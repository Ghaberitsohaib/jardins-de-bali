import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('modal') || l.includes('Modal') || l.includes('dialog') || l.includes('Dialog')) {
    console.log(idx + 1, l.trim().substring(0, 100));
  }
});

const js = fs.readFileSync('src/retail-spaces.js', 'utf8');
const jslines = js.split('\n');
jslines.forEach((l, idx) => {
  if (l.includes('openUnitModal') || l.includes('modal') || l.includes('Modal')) {
    console.log('JS:', idx + 1, l.trim().substring(0, 100));
  }
});

