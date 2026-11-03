import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const idx = main.indexOf('data-scroll-to');
console.log(main.substring(idx - 100, idx + 600));

