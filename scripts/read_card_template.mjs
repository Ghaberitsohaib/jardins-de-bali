import fs from 'fs';

const code = fs.readFileSync('src/retail-spaces.js', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(275, 345).join('\n'));
