import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
let idx = 0;
while ((idx = main.indexOf('arborHero', idx)) !== -1) {
  console.log('main.js arborHero match:', main.substring(Math.max(0, idx - 100), idx + 300));
  idx += 9;
}

