import fs from 'fs';

const files = fs.readdirSync('.').concat(fs.readdirSync('src').map(f => 'src/' + f));
for (const f of files) {
  if (fs.statSync(f).isFile() && (f.endsWith('.html') || f.endsWith('.js'))) {
    const c = fs.readFileSync(f, 'utf8');
    if (c.toLowerCase().includes('filtres commerciaux') || c.toLowerCase().includes('resultats') || c.toLowerCase().includes('type d\'espace')) {
      console.log('Found in', f);
    }
  }
}

