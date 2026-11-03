import fs from 'fs';

const html = fs.readFileSync('business.html', 'utf8');
const start = html.indexOf('<section id="Hero"');
const end = html.indexOf('</section>', start) + 10;
console.log('=== business.html Hero Section ===');
console.log(html.substring(start, end));

