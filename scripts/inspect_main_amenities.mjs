import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const idx = main.indexOf('Amenities');
console.log(main.substring(idx - 100, idx + 1200));

