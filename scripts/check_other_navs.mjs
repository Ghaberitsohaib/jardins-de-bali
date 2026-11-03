import fs from 'fs';

const files = ['about-the-investor.html', 'business.html', 'contact.html', 'maquette3d.html', 'residences.html', 'retail-spaces.html', 'ventes.html'];
for (const f of files) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    let has = c.includes('Location');
    console.log(f, 'includes Location:', has);
  }
}

