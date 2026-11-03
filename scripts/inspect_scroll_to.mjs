import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

console.log('main.js data-scroll-to:', main.includes('data-scroll-to'));
let idx = 0;
while ((idx = main.indexOf('scroll-to', idx)) !== -1) {
  console.log('main.js match:', main.substring(idx - 50, idx + 100));
  idx += 9;
}

idx = 0;
while ((idx = main.indexOf('scrollTo', idx)) !== -1) {
  console.log('main.js scrollTo:', main.substring(idx - 50, idx + 100));
  idx += 8;
}

