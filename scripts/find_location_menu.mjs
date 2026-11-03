import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
let idx = 0;
while ((idx = html.indexOf('Location', idx)) !== -1) {
  console.log(`Match at ${idx}:`);
  console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  idx += 8;
}

