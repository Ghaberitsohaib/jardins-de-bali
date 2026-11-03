import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const queries = ['<video', 'arborHero', 'id="hero"', 'Hero'];
for (const q of queries) {
  let idx = 0;
  while ((idx = html.indexOf(q, idx)) !== -1) {
    console.log(`Match "${q}" at ${idx}:`);
    console.log(html.substring(Math.max(0, idx - 100), idx + 250));
    idx += q.length;
  }
}

