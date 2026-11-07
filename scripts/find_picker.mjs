import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('id="Picker"') || l.includes('Picker')) {
    console.log(idx + 1, l.trim().substring(0, 120));
  }
});
