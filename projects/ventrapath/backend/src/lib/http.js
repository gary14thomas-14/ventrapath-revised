export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);

  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  });

  res.end(body);
}

export function ok(res, data, statusCode = 200) {
  sendJson(res, statusCode, { ok: true, data });
}

export function fail(res, statusCode, code, message, extra = {}) {
  sendJson(res, statusCode, {
    ok: false,
    error: {
      code,
      message,
      ...extra,
    },
  });
}

export function notFound(res, message = 'Route not found') {
  return fail(res, 404, 'NOT_FOUND', message);
}

export function methodNotAllowed(res, message = 'Method not allowed') {
  return fail(res, 405, 'METHOD_NOT_ALLOWED', message);
}

export function notImplemented(res, message = 'Route scaffold exists but implementation has not landed yet') {
  return fail(res, 501, 'NOT_IMPLEMENTED', message);
}

export async function parseJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return null;
  }

  const raw = Buffer.concat(chunks).toString('utf8');

  if (!raw.trim()) {
    return null;
  }

  return JSON.parse(raw);
}
