import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/retail-spaces-data.json', 'utf8'));
console.log(JSON.stringify(data, null, 2));
