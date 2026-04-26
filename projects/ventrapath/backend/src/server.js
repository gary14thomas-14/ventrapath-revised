import { createServer } from 'node:http';
import { loadEnv } from './config/env.js';
import { fail } from './lib/http.js';
import { handleRequest } from './app.js';

const env = loadEnv();

const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res, env);
  } catch (error) {
    console.error('[ventrapath-backend] unhandled request error', error);
    fail(res, 500, 'INTERNAL_ERROR', 'Unhandled server error');
  }
});

server.listen(env.port, () => {
  console.log(`[ventrapath-backend] listening on ${env.appBaseUrl}`);
});
