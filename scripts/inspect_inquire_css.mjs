import fs from 'fs';

const css = fs.readFileSync('src/arbor.css', 'utf8');
const idx = css.indexOf('.arbor-inquire-btn');
console.log(css.substring(idx, idx + 600));

