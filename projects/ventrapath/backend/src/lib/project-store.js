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
    ) {
      throw new Error('Project store is malformed');
    }

    parsed.blueprintVersions ??= [];

    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { projects: [], blueprintVersions: [] };
    }

    throw error;
  }
}

async function writeStore(store) {
  await ensureStoreDir();
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

export async function listProjectsForUser(userId) {
  const store = await readStore();

  return store.projects
    .filter((project) => project.userId === userId)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function createProject(project) {
  const store = await readStore();
  store.projects.push(project);
  await writeStore(store);
  return project;
}

export async function getProjectByIdForUser(projectId, userId) {
  const store = await readStore();

  return store.projects.find((project) => project.id === projectId && project.userId === userId) ?? null;
}

export async function createBlueprintVersionForProject(projectId, userId, sections) {
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
}

export async function getLatestBlueprintForProject(projectId, userId) {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === projectId && item.userId === userId);

  if (!project) {
    return null;
  }

  return store.blueprintVersions
    .filter((item) => item.projectId === projectId)
    .sort((a, b) => b.version - a.version)[0] ?? null;
}

export async function listBlueprintVersionsForProject(projectId, userId) {
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
}
