// Minimal foreground static server over ./dist that mimics GitHub Pages routing.
// Used by Playwright's webServer so the e2e suite does not depend on `astro preview`,
// which now daemonizes on Astro 7 and makes Playwright think the server exited.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.argv[2] ?? process.env.PORT ?? 4321);
const host = process.argv[3] ?? '127.0.0.1';
const dist = path.resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp', '.jpg': 'image/jpeg',
};

async function isFile(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}

async function resolve(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, '') || '/';
  const relative = clean === '/' ? '' : clean.replace(/^\//, '');
  const target = path.resolve(dist, relative);
  if (!target.startsWith(dist)) return null;
  const candidates = path.extname(relative)
    ? [target]
    : [path.join(target, 'index.html'), `${target}.html`];
  for (const candidate of candidates) if (await isFile(candidate)) return candidate;
  return null;
}

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', `http://${host}:${port}`);
  const file = (await resolve(pathname)) ?? null;
  const status = file ? 200 : 404;
  const body = await readFile(file ?? path.join(dist, '404.html')).catch(() => Buffer.from('Not found'));
  const type = types[path.extname(file ?? '404.html')] ?? 'application/octet-stream';
  response.writeHead(status, { 'content-type': type, 'content-length': body.length, 'cache-control': 'no-store' });
  response.end(request.method === 'HEAD' ? undefined : body);
});

server.listen(port, host, () => {
  console.log(`Static server for dist ready at http://${host}:${port}`);
});
