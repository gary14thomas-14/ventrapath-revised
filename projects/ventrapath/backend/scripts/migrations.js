import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const rootDir = resolve(process.cwd());
const migrationsDir = join(rootDir, 'migrations');
const MIGRATION_PATTERN = /^(\d{4})_[a-z0-9_]+\.sql$/;

function getMigrationFiles() {
  if (!existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  return readdirSync(migrationsDir)
    .filter((file) => MIGRATION_PATTERN.test(file))
    .sort();
}

function parseMigration(file) {
  const match = file.match(MIGRATION_PATTERN);

  if (!match) {
    throw new Error(`Invalid migration filename: ${file}`);
  }

  const number = Number(match[1]);
  const fullPath = join(migrationsDir, file);
  const sql = readFileSync(fullPath, 'utf8');

  return {
    file,
    number,
    fullPath,
    sql,
  };
}

function listMigrations() {
  const migrations = getMigrationFiles().map(parseMigration);

  if (migrations.length === 0) {
    console.log('No migrations found.');
    return;
  }

  for (const migration of migrations) {
    const firstLine = migration.sql.split(/\r?\n/).find((line) => line.trim()) ?? '';
    console.log(`${migration.file} :: ${firstLine.trim()}`);
  }
}

function verifyMigrations() {
  const files = getMigrationFiles();

  if (files.length === 0) {
    throw new Error('No migration files found to verify.');
  }

  let expected = parseMigration(files[0]).number;

  for (const file of files) {
    const migration = parseMigration(file);

    if (migration.number !== expected) {
      throw new Error(`Migration sequence gap or disorder at ${file}. Expected ${String(expected).padStart(4, '0')}.`);
    }

    if (!migration.sql.trim()) {
      throw new Error(`Migration ${file} is empty.`);
    }

    if (!migration.sql.includes('-- up')) {
      throw new Error(`Migration ${file} is missing an '-- up' section marker.`);
    }

    expected += 1;
  }

  console.log(`Verified ${files.length} migration(s) in ${migrationsDir}`);
}

async function applyMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for migrations:apply');
  }

  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query('begin');
    await client.query('create extension if not exists pgcrypto;');
    await client.query(`
      create table if not exists schema_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `);
    await client.query('commit');

    const appliedResult = await client.query('select version from schema_migrations');
    const appliedVersions = new Set(appliedResult.rows.map((row) => row.version));

    const migrations = getMigrationFiles().map(parseMigration);
    let appliedCount = 0;

    for (const migration of migrations) {
      const version = migration.file.slice(0, 4);

      if (appliedVersions.has(version)) {
        continue;
      }

      await client.query('begin');

      try {
        await client.query(migration.sql);
        await client.query('insert into schema_migrations (version) values ($1)', [version]);
        await client.query('commit');
        appliedCount += 1;
        console.log(`Applied ${migration.file}`);
      } catch (error) {
        await client.query('rollback');
        throw new Error(`Failed applying ${migration.file}: ${error.message}`);
      }
    }

    if (appliedCount === 0) {
      console.log('No pending migrations to apply.');
    } else {
      console.log(`Applied ${appliedCount} migration(s).`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

const command = process.argv[2] ?? 'list';

if (command === 'list') {
  listMigrations();
} else if (command === 'verify') {
  verifyMigrations();
} else if (command === 'apply') {
  await applyMigrations();
} else {
  console.error(`Unknown migration command: ${command}`);
  process.exit(1);
}
