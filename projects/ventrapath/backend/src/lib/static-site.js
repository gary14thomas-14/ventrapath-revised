import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const frontendDistDir = resolve(process.cwd(), '../frontend/dist');

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

function sendFile(req, res, filePath) {
  const contentType = mimeTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream';
  const stats = statSync(filePath);

  res.writeHead(200, {
    'content-type': contentType,
    'content-length': stats.size,
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    }
    res.end('Failed to read static asset');
  });
  stream.pipe(res);
}

export function handleStaticSite(req, res, pathname) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    return false;
  }

  if (!existsSync(frontendDistDir)) {
    return false;
  }

  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const candidatePath = resolve(frontendDistDir, `.${requestedPath}`);

  if (candidatePath.startsWith(frontendDistDir) && existsSync(candidatePath) && statSync(candidatePath).isFile()) {
    sendFile(req, res, candidatePath);
    return true;
  }

  const indexPath = resolve(frontendDistDir, 'index.html');

  if (!existsSync(indexPath)) {
    return false;
  }

  sendFile(req, res, indexPath);
  return true;
}
