import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';

const dist = path.join(root, 'dist');
async function files(dir) {
  const results = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...await files(filename));
    else results.push(filename);
  }
  return results;
}
const htmlFiles = (await files(dist)).filter(f => f.endsWith('.html'));
let checked = 0;
const failures = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (!/<html lang="(ko|en)"/.test(html)) failures.push(`${file}: missing language`);
  for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
    const url = new URL(href, 'https://portfolio.test/' + path.relative(dist, file));
    let target = path.join(dist, decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
      if (url.hash && target.endsWith('.html')) {
        const content = await readFile(target, 'utf8');
        if (!content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error('missing anchor');
      }
      checked++;
    } catch { failures.push(`${path.relative(dist, file)} → ${href}`); }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated ${htmlFiles.length} HTML pages and ${checked} local links, assets, and anchors.`);
