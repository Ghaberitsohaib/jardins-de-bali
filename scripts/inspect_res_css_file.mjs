import fs from 'fs';

const css = fs.readFileSync('src/residences.css', 'utf8');
const idx = css.indexOf('.residences-hero');
console.log('=== src/residences.css ===');
console.log(css.substring(idx, idx + 2500));

