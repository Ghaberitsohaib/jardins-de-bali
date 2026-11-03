import fs from 'fs';

const html = fs.readFileSync('residences.html', 'utf8');
const idx = html.indexOf('RESIDENCES');
console.log('=== residences.html hero ===');
console.log(html.substring(Math.max(0, idx - 400), idx + 1400));

