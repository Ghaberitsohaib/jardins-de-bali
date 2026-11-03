import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('business.mp4');
console.log('Index:', idx);
console.log(JSON.stringify(html.substring(idx - 160, idx + 260)));

