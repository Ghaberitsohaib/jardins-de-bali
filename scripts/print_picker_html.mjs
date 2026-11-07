import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const lines = html.split('\n');
console.log('=== Lines 75-105 ===');
console.log(lines.slice(74, 105).join('\n'));
console.log('=== Lines 865-920 ===');
console.log(lines.slice(865, 920).join('\n'));
