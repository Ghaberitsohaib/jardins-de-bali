import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('arbor-mobile-inquire-pill');
console.log(html.substring(idx - 100, idx + 500));

