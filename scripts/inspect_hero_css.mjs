import fs from 'fs';

const css = fs.readFileSync('src/arbor.css', 'utf8');
const idx = css.indexOf('.arbor-hero-video');
console.log(css.substring(Math.max(0, idx - 100), idx + 600));

