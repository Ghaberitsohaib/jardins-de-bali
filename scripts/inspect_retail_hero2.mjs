import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const idx = html.indexOf('Une adresse de prestige où chaque commerce');
console.log('=== retail-spaces.html body hero ===');
console.log(html.substring(Math.max(0, idx - 1200), idx + 800));

