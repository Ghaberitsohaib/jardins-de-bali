import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
let idx = html.indexOf('around');
while (idx !== -1) {
  console.log('around match at', idx, ':', html.substring(Math.max(0, idx - 100), idx + 200));
  idx = html.indexOf('around', idx + 1);
}

