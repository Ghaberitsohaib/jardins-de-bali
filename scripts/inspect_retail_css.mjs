import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const idx = html.indexOf('.retail-hero-scrim');
console.log('=== CSS in retail-spaces.html ===');
console.log(html.substring(idx - 50, idx + 2500));

