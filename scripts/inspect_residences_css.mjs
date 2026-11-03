import fs from 'fs';

const html = fs.readFileSync('residences.html', 'utf8');
const idx = html.indexOf('.residences-hero');
console.log('=== CSS in residences.html ===');
console.log(html.substring(idx - 30, idx + 2500));

