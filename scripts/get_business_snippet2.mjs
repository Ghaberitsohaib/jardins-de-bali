import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('business.mp4');
console.log(html.substring(idx - 300, idx + 200));

