import { createJsonProjectStore } from './stores/json-project-store.js';
import { createPostgresProjectStore } from './stores/postgres-project-store.js';

const stores = new Map();

function getStoreKey(env) {
  const driver = env.persistenceDriver ?? 'json';
  const databaseUrl = env.databaseUrl ?? 'no-db';
  return `${driver}:${databaseUrl}`;
}

function buildStore(env) {
  if (env.persistenceDriver === 'postgres') {
    return createPostgresProjectStore(env);
  }

  return createJsonProjectStore(env);
}

function getStore(env) {
  const key = getStoreKey(env);

  if (!stores.has(key)) {
    stores.set(key, buildStore(env));
  }

  return stores.get(key);
}

export async function listProjectsForUser(userId, env) {
  return getStore(env).listProjectsForUser(userId);
}

export async function createProject(project, env) {
  return getStore(env).createProject(project);
}

export async function getProjectByIdForUser(projectId, userId, env) {
  return getStore(env).getProjectByIdForUser(projectId, userId);
}

export async function createBlueprintVersionForProject(projectId, userId, sections, env) {
  return getStore(env).createBlueprintVersionForProject(projectId, userId, sections);
}

export async function getLatestBlueprintForProject(projectId, userId, env) {
  return getStore(env).getLatestBlueprintForProject(projectId, userId);
}

export async function listBlueprintVersionsForProject(projectId, userId, env) {
  return getStore(env).listBlueprintVersionsForProject(projectId, userId);
}

export async function getAgentOutputCacheEntry(projectId, userId, cacheKey, env) {
  return getStore(env).getAgentOutputCacheEntry(projectId, userId, cacheKey);
}

export async function upsertAgentOutputCacheEntry(projectId, userId, entry, env) {
  return getStore(env).upsertAgentOutputCacheEntry(projectId, userId, entry);
}

export async function getPhaseInstanceForProject(projectId, userId, phaseNumber, env) {
  return getStore(env).getPhaseInstanceForProject(projectId, userId, phaseNumber);
}

export async function upsertPhaseInstanceForProject(projectId, userId, phase, env) {
  return getStore(env).upsertPhaseInstanceForProject(projectId, userId, phase);
}
