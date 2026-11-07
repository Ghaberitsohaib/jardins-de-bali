import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.retail-picker-container') || l.includes('#Picker') || l.includes('.picker-sidebar') || l.includes('#retailGrid')) {
    console.log(idx + 1, l);
  }
});
