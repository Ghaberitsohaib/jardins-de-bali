import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
let idx = 0;
while ((idx = main.indexOf('heroVideo', idx)) !== -1) {
  console.log('--- match ---');
  console.log(main.substring(Math.max(0, idx - 50), idx + 250));
  idx += 9;
}

