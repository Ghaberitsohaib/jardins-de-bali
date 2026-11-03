import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
let idx = 0;
while ((idx = html.toLowerCase().indexOf('type d\'espace', idx)) !== -1) {
  console.log('Match at', idx, ':');
  console.log(html.substring(Math.max(0, idx - 400), idx + 600));
  idx += 13;
}

idx = 0;
while ((idx = html.toLowerCase().indexOf('filtres', idx)) !== -1) {
  console.log('Filtres match at', idx, ':');
  console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  idx += 7;
}

