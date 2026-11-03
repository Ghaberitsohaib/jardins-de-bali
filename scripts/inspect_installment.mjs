import fs from 'fs';

const belgrade = fs.readFileSync('scripts/belgrade_installment.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

console.log('--- BELGRADE CLASSES WITH installment ---');
const regex = /class="([^"]*installment[^"]*)"/g;
let m;
while ((m = regex.exec(belgrade)) !== null) {
  console.log('Belgrade:', m[1]);
}

const instIndex = index.indexOf('id="Installment"');
const instSection = index.substring(instIndex, instIndex + 3000);
console.log('\n--- INDEX.HTML Installment snippet ---');
console.log(instSection);

