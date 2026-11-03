import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const queries = ['id="around"', 'id="Around"', 'AMENITIES', 'Amenities'];
for (const q of queries) {
  let idx = 0;
  while ((idx = html.indexOf(q, idx)) !== -1) {
    console.log(`\n=== Found "${q}" at ${idx} ===`);
    console.log(html.substring(Math.max(0, idx - 300), idx + 800));
    idx += q.length;
  }
}

