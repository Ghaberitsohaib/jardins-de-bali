import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const idx = main.lastIndexOf('open-contact-btn');
console.log(main.substring(idx - 50, idx + 600));

