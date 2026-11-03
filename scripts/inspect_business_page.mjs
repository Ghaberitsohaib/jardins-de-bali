import fs from 'fs';

const html = fs.readFileSync('business.html', 'utf8');
const idx = html.indexOf('BUSINESS SPACES');
console.log('=== business.html hero ===');
console.log(html.substring(Math.max(0, idx - 500), idx + 1000));

