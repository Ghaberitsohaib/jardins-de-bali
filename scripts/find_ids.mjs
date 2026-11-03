import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const queries = ['3d', 'canvas', 'map', 'hero'];
for (const q of queries) {
  let matches = [...html.matchAll(new RegExp(`id="[^"]*${q}[^"]*"`, 'gi'))].map(m => m[0]);
  if (matches.length) console.log(q, matches);
}

