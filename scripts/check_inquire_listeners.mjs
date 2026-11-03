import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
console.log('Includes arbor-inquire-btn:', main.includes('arbor-inquire-btn'));

