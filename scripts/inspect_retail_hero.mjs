import fs from 'fs';

const retailHtml = fs.readFileSync('retail-spaces.html', 'utf8');
const idx = retailHtml.indexOf('RETAIL & BUSINESS SPACES');
console.log('=== retail-spaces.html hero snippet ===');
console.log(retailHtml.substring(Math.max(0, idx - 800), idx + 1200));

