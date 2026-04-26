import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function stripWrappingQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

export function loadEnvFile(rootDir = process.cwd()) {
  const envPath = join(rootDir, '.env');

  if (!existsSync(envPath)) {
    return;
  }

  const raw = readFileSync(envPath, 'utf8');
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = stripWrappingQuotes(trimmed.slice(separatorIndex + 1).trim());

    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}
