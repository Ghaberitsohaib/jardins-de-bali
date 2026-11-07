import fs from 'fs';

const js = fs.readFileSync('src/retail-spaces.js', 'utf8');
const lines = js.split('\n');
console.log(lines.slice(270, 360).join('\n'));
