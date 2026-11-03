import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const idx = main.indexOf('if (heroVideo && heroFinalImg)');
console.log(main.substring(idx - 100, idx + 800));

