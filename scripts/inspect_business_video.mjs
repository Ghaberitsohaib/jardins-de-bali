import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('data-src="/home/business/business.mp4"');
console.log(html.substring(idx - 600, idx + 400));

