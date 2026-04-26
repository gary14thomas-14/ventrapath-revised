import { ok } from '../lib/http.js';

export function handleHealth(req, res, env) {
  return ok(res, {
    service: 'ventrapath-backend',
    status: 'ok',
    environment: env.nodeEnv,
    baseUrl: env.appBaseUrl,
    now: new Date().toISOString(),
  });
}
