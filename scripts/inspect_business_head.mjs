import fs from 'fs';

const html = fs.readFileSync('business.html', 'utf8');
const headEnd = html.indexOf('</head>');
console.log('=== business.html head ===');
console.log(html.substring(0, headEnd));

