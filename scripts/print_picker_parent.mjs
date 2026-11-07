import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(830, 895).join('\n'));
