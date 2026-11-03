import fs from 'fs';

const js = fs.readFileSync('scripts/matched_roots_chunk.js', 'utf8');

// Find occurrences of RootsMobile
let idx = 0;
while ((idx = js.indexOf('RootsMobile', idx)) !== -1) {
  console.log(`\n=== MATCH AT ${idx} ===`);
  console.log(js.slice(Math.max(0, idx - 400), idx + 1200));
  idx += 'RootsMobile'.length;
}

