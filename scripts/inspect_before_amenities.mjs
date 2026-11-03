import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('id="Amenities"');
console.log('Snippet before Amenities:');
console.log(html.substring(idx - 1500, idx + 400));

