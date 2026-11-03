import fs from 'fs';

const css = fs.readFileSync('src/residences.css', 'utf8');
console.log(css.substring(0, 1800));

