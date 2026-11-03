import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const idx = html.indexOf('class="retail-hero-btn');
console.log(html.substring(idx, idx + 800));

