import fs from 'fs';

const c = fs.readFileSync('scripts/matched_roots_chunk.js', 'utf8');
let idx = c.indexOf('id:"Amenities"');
if (idx === -1) idx = c.indexOf('Amenities');
console.log('Amenities in chunk:', idx);
if (idx !== -1) {
  console.log(c.substring(Math.max(0, idx - 800), idx + 800));
}

