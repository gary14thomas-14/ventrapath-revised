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

    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.projects)) {
      throw new Error('Project store is malformed');
    }

    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { projects: [] };
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
