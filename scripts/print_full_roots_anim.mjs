import fs from 'fs';

const js = fs.readFileSync('scripts/matched_roots_chunk.js', 'utf8');
console.log(js.slice(49600, 52200));

