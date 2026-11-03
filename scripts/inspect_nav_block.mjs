import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('<nav class="arbor-nav-list"');
console.log(html.substring(idx, idx + 1200));

