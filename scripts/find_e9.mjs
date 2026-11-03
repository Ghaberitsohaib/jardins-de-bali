import fs from 'fs';

const c = fs.readFileSync('scripts/matched_roots_chunk.js', 'utf8');
const idx = c.indexOf('function e9(');
console.log('function e9 at', idx);
if (idx !== -1) {
  console.log(c.substring(idx, idx + 2000));
} else {
  // search for e9= or similar
  const matches = [...c.matchAll(/(?:function\s+e9|var\s+e9\s*=|const\s+e9\s*=|let\s+e9\s*=)/g)];
  console.log('matches:', matches.map(m => m[0]));
}

