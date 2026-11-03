import fs from 'fs';

const c = fs.readFileSync('scripts/matched_roots_chunk.js', 'utf8');
const queries = ['id:"Residences"', 'id:"BusinessSpaces"'];
for (const q of queries) {
  let idx = c.indexOf(q);
  if (idx !== -1) {
    console.log(`\n=== Found ${q} at ${idx} ===`);
    console.log(c.substring(Math.max(0, idx - 800), idx + 800));
  }
}

