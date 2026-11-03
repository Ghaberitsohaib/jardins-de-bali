import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
let idx = 0;
while ((idx = main.indexOf('open-contact-btn', idx)) !== -1) {
  console.log(main.substring(Math.max(0, idx - 80), idx + 250));
  idx += 16;
}

