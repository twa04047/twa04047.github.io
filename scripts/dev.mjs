import http from 'node:http';
import { readFile, stat, watch } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';

await build();
const dist = path.join(root, 'dist');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.mp4':'video/mp4', '.webm':'video/webm', '.vtt':'text/vtt' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let filename = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (filename !== dist && !filename.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
    const info = await stat(filename);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) { res.writeHead(301, { location: url.pathname + '/' + url.search }).end(); return; }
      filename = path.join(filename, 'index.html');
    }
    res.writeHead(200, { 'content-type': mime[path.extname(filename)] || 'application/octet-stream', 'cache-control':'no-store' });
    res.end(await readFile(filename));
  } catch { res.writeHead(404, { 'content-type':'text/plain; charset=utf-8' }).end('Page not found'); }
});
server.listen(4173, '127.0.0.1', () => console.log('Portfolio preview: http://127.0.0.1:4173/ko/'));
server.on('error', error => { console.error(error.message); process.exit(1); });

let timer;
let building = false;
let queued = false;
async function rebuild() {
  if (building) { queued = true; return; }
  building = true;
  try { await build(); } catch (error) { console.error('Build failed:', error.message); }
  finally { building = false; if (queued) { queued = false; await rebuild(); } }
}
for (const directory of ['src', 'content', 'public']) {
  (async () => {
    for await (const event of watch(path.join(root, directory), { recursive: true })) {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 120);
    }
  })().catch(error => console.error('Watch error:', error.message));
}
