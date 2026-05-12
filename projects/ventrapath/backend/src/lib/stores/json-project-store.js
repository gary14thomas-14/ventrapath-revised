import { randomUUID } from 'node:crypto';
import { copyFile, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const storePath = resolve(process.cwd(), '.data', 'projects.json');

async function ensureStoreDir() {
  await mkdir(dirname(storePath), { recursive: true });
}

function createEmptyStore() {
  return { projects: [], blueprintVersions: [], agentOutputCache: [], phaseInstances: [] };
}

function normalizeStore(parsed) {
  if (
    !parsed
    || typeof parsed !== 'object'
    || !Array.isArray(parsed.projects)
    || (parsed.blueprintVersions != null && !Array.isArray(parsed.blueprintVersions))
    || (parsed.agentOutputCache != null && !Array.isArray(parsed.agentOutputCache))
    || (parsed.phaseInstances != null && !Array.isArray(parsed.phaseInstances))
  ) {
    throw new Error('Project store is malformed');
  }

  parsed.blueprintVersions ??= [];
  parsed.agentOutputCache ??= [];
  parsed.phaseInstances ??= [];

  return parsed;
}

function tryRepairTruncatedJson(raw) {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return null;

  const blueprintMarker = '\n  ],\n  "blueprintVersions": [';
  const cacheMarker = '\n  ],\n  "agentOutputCache": [';
  const phaseMarker = '\n  ],\n  "phaseInstances": [';

  const blueprintIndex = trimmed.indexOf(blueprintMarker);
  const cacheIndex = trimmed.indexOf(cacheMarker);
  const phaseIndex = trimmed.indexOf(phaseMarker);

  if (blueprintIndex === -1 || cacheIndex === -1 || phaseIndex === -1) return null;

  const repaired = `${trimmed.slice(0, phaseIndex)}\n  ],\n  "phaseInstances": []\n}`;
  return repaired;
}

async function parseStoreFileWithRecovery(raw) {
  try {
    return normalizeStore(JSON.parse(raw));
  } catch (parseError) {
    if (parseError instanceof SyntaxError) {
      const repaired = tryRepairTruncatedJson(raw);
      if (repaired) {
        const parsed = normalizeStore(JSON.parse(repaired));
        await writeStore(parsed);
        return parsed;
      }
    }

    throw parseError;
  }
}

async function readStore() {
  await ensureStoreDir();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const raw = await readFile(storePath, 'utf8');
      return await parseStoreFileWithRecovery(raw);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return createEmptyStore();
      }

      const shouldRetry = error instanceof SyntaxError && attempt < 2;
      if (!shouldRetry) {
        throw error;
      }

      await delay(40 * (attempt + 1));
    }
  }

  return createEmptyStore();
}

let writeQueue = Promise.resolve();
let mutationQueue = Promise.resolve();

async function replaceStoreFile(tempPath) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rename(tempPath, storePath);
      return;
    } catch (error) {
      if (error?.code !== 'EPERM') {
        throw error;
      }

      if (attempt === 4) {
        await copyFile(tempPath, storePath);
        await unlink(tempPath).catch(() => {});
        return;
      }

      await delay(40 * (attempt + 1));
    }
  }
}

async function writeStore(store) {
  await ensureStoreDir();
  const serialized = JSON.stringify(store, null, 2);

  writeQueue = writeQueue.then(async () => {
    const tempPath = `${storePath}.${randomUUID()}.tmp`;
    await writeFile(tempPath, serialized);
    await replaceStoreFile(tempPath);
  });

  return writeQueue;
}

async function mutateStore(mutator) {
  mutationQueue = mutationQueue.then(async () => {
    const store = await readStore();
    const { result, changed = true } = await mutator(store);

    if (changed) {
      await writeStore(store);
    }

    return result;
  });

  return mutationQueue;
}

export function createJsonProjectStore() {
  return {
    async listProjectsForUser(userId) {
      const store = await readStore();

      return store.projects
        .filter((project) => project.userId === userId)
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    },

    async createProject(project) {
      return mutateStore(async (store) => {
        store.projects.push(project);
        return { result: project };
      });
    },

    async getProjectByIdForUser(projectId, userId) {
      const store = await readStore();
      return store.projects.find((project) => project.id === projectId && project.userId === userId) ?? null;
    },

    async createBlueprintVersionForProject(projectId, userId, sections) {
      return mutateStore(async (store) => {
        const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

        if (!project) {
          return { result: null, changed: false };
        }

        const existingVersions = store.blueprintVersions.filter((item) => item.projectId === projectId);
        const version = existingVersions.length + 1;
        const now = new Date().toISOString();

        const blueprint = {
          id: randomUUID(),
          projectId,
          version,
          status: 'ready',
          sections,
          meta: {
            country: project.country,
            region: project.region,
            currencyCode: project.currencyCode,
            generatedAt: now,
          },
          createdAt: now,
        };

        store.blueprintVersions.push(blueprint);
        project.status = 'blueprint_ready';
        project.latestBlueprintVersionNumber = version;
        project.updatedAt = now;

        return { result: blueprint };
      });
    },

    async getLatestBlueprintForProject(projectId, userId) {
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
      }

      return store.blueprintVersions
        .filter((item) => item.projectId === projectId)
        .sort((a, b) => b.version - a.version)[0] ?? null;
    },

    async listBlueprintVersionsForProject(projectId, userId) {
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
      }

      return store.blueprintVersions
        .filter((item) => item.projectId === projectId)
        .sort((a, b) => b.version - a.version)
        .map((item) => ({
          version: item.version,
          generatedAt: item.meta.generatedAt,
        }));
    },

    async getAgentOutputCacheEntry(projectId, userId, cacheKey) {
      return mutateStore(async (store) => {
        const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

        if (!project) {
          return { result: null, changed: false };
        }

        const entry = store.agentOutputCache.find((item) => item.projectId === projectId && item.cacheKey === cacheKey) ?? null;

        if (!entry) {
          return { result: null, changed: false };
        }

        if (entry.expiresAt && new Date(entry.expiresAt).getTime() <= Date.now()) {
          return { result: null, changed: false };
        }

        entry.lastUsedAt = new Date().toISOString();
        return { result: entry };
      });
    },

    async upsertAgentOutputCacheEntry(projectId, userId, entry) {
      return mutateStore(async (store) => {
        const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

        if (!project) {
          return { result: null, changed: false };
        }

        const now = new Date().toISOString();
        const existingIndex = store.agentOutputCache.findIndex((item) => item.projectId === projectId && item.cacheKey === entry.cacheKey);
        const record = {
          id: existingIndex >= 0 ? store.agentOutputCache[existingIndex].id : randomUUID(),
          projectId,
          phaseNumber: entry.phaseNumber ?? null,
          stepKey: entry.stepKey ?? null,
          agentId: entry.agentId,
          taskKind: entry.taskKind,
          cacheKey: entry.cacheKey,
          model: entry.model,
          promptVersionHash: entry.promptVersionHash,
          normalizedInputHash: entry.normalizedInputHash,
          dependencyHash: entry.dependencyHash,
          status: entry.status ?? 'ready',
          outputJson: entry.outputJson,
          sourceMetaJson: entry.sourceMetaJson ?? null,
          expiresAt: entry.expiresAt ?? null,
          createdAt: existingIndex >= 0 ? store.agentOutputCache[existingIndex].createdAt : now,
          lastUsedAt: now,
        };

        if (existingIndex >= 0) {
          store.agentOutputCache[existingIndex] = record;
        } else {
          store.agentOutputCache.push(record);
        }

        return { result: record };
      });
    },

    async getPhaseInstanceForProject(projectId, userId, phaseNumber) {
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
      }

      return store.phaseInstances.find((item) => item.projectId === projectId && item.phaseNumber === phaseNumber) ?? null;
    },

    async upsertPhaseInstanceForProject(projectId, userId, phase) {
      return mutateStore(async (store) => {
        const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

        if (!project) {
          return { result: null, changed: false };
        }

        const now = new Date().toISOString();
        const existingIndex = store.phaseInstances.findIndex((item) => item.projectId === projectId && item.phaseNumber === phase.phaseNumber);
        const record = {
          id: existingIndex >= 0 ? store.phaseInstances[existingIndex].id : randomUUID(),
          projectId,
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          state: phase.state,
          summary: phase.summary,
          generatedContent: phase.generatedContent,
          userState: phase.userState ?? {},
          progress: phase.progress ?? {},
          tasks: phase.tasks,
          generatedAt: phase.generatedAt ?? now,
          createdAt: existingIndex >= 0 ? store.phaseInstances[existingIndex].createdAt : now,
          updatedAt: now,
        };

        if (existingIndex >= 0) {
          store.phaseInstances[existingIndex] = record;
        } else {
          store.phaseInstances.push(record);
        }

        project.currentPhaseNumber = Math.max(project.currentPhaseNumber ?? 0, phase.phaseNumber);
        project.status = 'in_progress';
        project.updatedAt = now;

        return { result: record };
      });
    },
  };
}
