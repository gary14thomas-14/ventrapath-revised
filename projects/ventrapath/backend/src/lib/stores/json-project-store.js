import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const storePath = resolve(process.cwd(), '.data', 'projects.json');

async function ensureStoreDir() {
  await mkdir(dirname(storePath), { recursive: true });
}

async function readStore() {
  await ensureStoreDir();

  try {
    const raw = await readFile(storePath, 'utf8');
    const parsed = JSON.parse(raw);

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
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { projects: [], blueprintVersions: [], agentOutputCache: [], phaseInstances: [] };
    }

    throw error;
  }
}

async function writeStore(store) {
  await ensureStoreDir();
  await writeFile(storePath, JSON.stringify(store, null, 2));
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
      const store = await readStore();
      store.projects.push(project);
      await writeStore(store);
      return project;
    },

    async getProjectByIdForUser(projectId, userId) {
      const store = await readStore();
      return store.projects.find((project) => project.id === projectId && project.userId === userId) ?? null;
    },

    async createBlueprintVersionForProject(projectId, userId, sections) {
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
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

      await writeStore(store);

      return blueprint;
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
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
      }

      const entry = store.agentOutputCache.find((item) => item.projectId === projectId && item.cacheKey === cacheKey) ?? null;

      if (!entry) {
        return null;
      }

      if (entry.expiresAt && new Date(entry.expiresAt).getTime() <= Date.now()) {
        return null;
      }

      entry.lastUsedAt = new Date().toISOString();
      await writeStore(store);
      return entry;
    },

    async upsertAgentOutputCacheEntry(projectId, userId, entry) {
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
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

      await writeStore(store);
      return record;
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
      const store = await readStore();
      const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

      if (!project) {
        return null;
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

      await writeStore(store);
      return record;
    },
  };
}
