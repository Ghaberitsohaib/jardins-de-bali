import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
let idx = 0;
let count = 0;
while ((idx = html.indexOf('Location', idx)) !== -1) {
  console.log(`Match at ${idx}:`, html.substring(Math.max(0, idx - 50), idx + 100));
  idx += 8;
  count++;
}
console.log('Total Location matches left:', count);

