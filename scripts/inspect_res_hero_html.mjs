import fs from 'fs';

const html = fs.readFileSync('residences.html', 'utf8');
const idx = html.indexOf('residences-hero-content');
console.log(html.substring(idx - 60, idx + 500));

