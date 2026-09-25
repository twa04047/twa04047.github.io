import http from 'node:http';
import { stat, watch } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { build, root } from './build.mjs';

await build();
const dist = path.join(root, 'dist');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.mp4':'video/mp4', '.webm':'video/webm', '.vtt':'text/vtt', '.pdf':'application/pdf' };
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
    const { size } = await stat(filename);
    const headers = { 'content-type': mime[path.extname(filename)] || 'application/octet-stream', 'cache-control':'no-store', 'accept-ranges':'bytes' };
    // Browser video controls request byte ranges when seeking through a recording.
    let start = 0, end = size - 1;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, { 'content-range': `bytes */${size}` }).end(); return; }
      start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
      if (start > end || start >= size) { res.writeHead(416, { 'content-range': `bytes */${size}` }).end(); return; }
      headers['content-range'] = `bytes ${start}-${end}/${size}`;
    }
    headers['content-length'] = Math.max(0, end - start + 1);
    res.writeHead(req.headers.range ? 206 : 200, headers);
    if (req.method === 'HEAD' || size === 0) { res.end(); return; }
    const stream = createReadStream(filename, { start, end });
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
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
