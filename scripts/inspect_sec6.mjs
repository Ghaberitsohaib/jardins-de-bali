import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const idx = main.indexOf('// 6. SHOWCASE SECTIONS');
console.log(main.substring(idx, idx + 2500));

