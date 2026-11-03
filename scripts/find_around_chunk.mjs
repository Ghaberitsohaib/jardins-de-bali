import fs from 'fs';

const c = fs.readFileSync('scripts/matched_roots_chunk.js', 'utf8');
let idx = 0;
while ((idx = c.indexOf('around', idx)) !== -1) {
  console.log('Match at', idx, ':', c.substring(Math.max(0, idx - 100), idx + 200));
  idx += 6;
}

