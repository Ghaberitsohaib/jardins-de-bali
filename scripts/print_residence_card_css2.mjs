import fs from 'fs';

const css = fs.readFileSync('src/residences.css', 'utf8');
const lines = css.split('\n');
console.log(lines.slice(830, 880).join('\n'));
