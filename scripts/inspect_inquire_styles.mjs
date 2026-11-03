import fs from 'fs';

const css = fs.readFileSync('src/arbor.css', 'utf8');
const idx1 = css.indexOf('.arbor-inquire-btn');
const idx2 = css.indexOf('.arbor-mobile-inquire-pill');
console.log('inquire-btn:', css.substring(idx1, idx1 + 300));
console.log('mobile-inquire-pill:', css.substring(idx2, idx2 + 300));

