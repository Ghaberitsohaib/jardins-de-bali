import fs from 'fs';

const css = fs.readFileSync('src/residences.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.filter-heading') || l.includes('filter-reset-btn')) {
    console.log(idx + 1, l);
    console.log(lines.slice(idx, idx + 15).join('\n'));
  }
});
