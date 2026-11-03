import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('id="Introduction"');
console.log(html.substring(idx, idx + 1500));

