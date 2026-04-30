import { loadEnvFile } from './load-env-file.js';

loadEnvFile(process.cwd());

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL
    ?? process.env.database_DATABASE_URL
    ?? process.env.POSTGRES_URL
    ?? process.env.database_POSTGRES_URL
    ?? null;
}

export function loadEnv() {
  const port = Number(process.env.PORT ?? 4000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  const databaseUrl = resolveDatabaseUrl();
  const persistenceDriver = process.env.PERSISTENCE_DRIVER ?? (databaseUrl ? 'postgres' : 'json');

  if (!['json', 'postgres'].includes(persistenceDriver)) {
    throw new Error('PERSISTENCE_DRIVER must be either "json" or "postgres"');
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port,
    appBaseUrl: process.env.APP_BASE_URL ?? `http://localhost:${port}`,
    persistenceDriver,
    databaseUrl,
  };
}
