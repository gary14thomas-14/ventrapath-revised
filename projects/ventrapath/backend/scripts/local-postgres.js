import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import EmbeddedPostgres from 'embedded-postgres';
import { Client } from 'pg';
import { loadEnvFile } from '../src/config/load-env-file.js';

loadEnvFile(process.cwd());

const rootDir = process.cwd();
const host = process.env.POSTGRES_HOST ?? '127.0.0.1';
const port = Number(process.env.POSTGRES_PORT ?? 5432);
const user = process.env.POSTGRES_USER ?? 'postgres';
const password = process.env.POSTGRES_PASSWORD ?? 'postgres';
const database = process.env.POSTGRES_DATABASE ?? 'ventrapath';
const databaseDir = resolve(rootDir, '.data', 'embedded-postgres');

async function ensureDatabaseExists() {
  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  await client.connect();

  try {
    const result = await client.query('select 1 from pg_database where datname = $1', [database]);

    if (result.rowCount === 0) {
      await client.query(`create database ${database}`);
      console.log(`[embedded-postgres] created database ${database}`);
    }
  } finally {
    await client.end();
  }
}

async function checkPostgres() {
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
  });

  await client.connect();

  try {
    const result = await client.query('select version() as version');
    console.log(result.rows[0].version);
  } finally {
    await client.end();
  }
}

function createEmbeddedPostgres() {
  return new EmbeddedPostgres({
    databaseDir,
    user,
    password,
    port,
    persistent: true,
    onLog: (message) => console.log(`[embedded-postgres] ${String(message).trim()}`),
    onError: (message) => console.error(`[embedded-postgres] ${String(message).trim()}`),
  });
}

async function stopPostgres() {
  const postgres = createEmbeddedPostgres();
  await postgres.stop();
  console.log('[embedded-postgres] stopped');
}

async function startPostgres() {
  await mkdir(databaseDir, { recursive: true });

  const postgres = createEmbeddedPostgres();

  await postgres.initialise();
  await postgres.start();
  await ensureDatabaseExists();

  console.log(`[embedded-postgres] ready on postgres://${user}:${password}@${host}:${port}/${database}`);

  const shutdown = async (signal) => {
    console.log(`[embedded-postgres] stopping on ${signal}`);
    await postgres.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  await new Promise(() => {});
}

const command = process.argv[2] ?? 'start';

if (command === 'start') {
  await startPostgres();
} else if (command === 'check') {
  await checkPostgres();
} else if (command === 'stop') {
  await stopPostgres();
} else {
  console.error(`Unknown local-postgres command: ${command}`);
  process.exit(1);
}
