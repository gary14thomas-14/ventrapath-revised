function requireEnv(name, fallback) {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadEnv() {
  const port = Number(process.env.PORT ?? 4000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port,
    appBaseUrl: requireEnv('APP_BASE_URL', `http://localhost:${port}`),
    databaseUrl: process.env.DATABASE_URL ?? null,
  };
}
