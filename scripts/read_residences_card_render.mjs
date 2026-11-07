import fs from 'fs';

const code = fs.readFileSync('src/residences.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('renderGrid') || l.includes('residencesGrid') || (idx > 280 && idx < 360)) {
    console.log(idx + 1, l.trim().substring(0, 100));
  }
});
