import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('Location');
console.log(html.substring(idx - 600, idx + 400));

