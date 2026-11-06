import fs from 'fs';

const files = [
  'about-the-investor.html',
  'business.html',
  'contact.html',
  'index.html',
  'maquette3d.html',
  'residences.html',
  'retail-spaces.html',
  'ventes.html'
];

const targetRegex = /\s*<div class="arbor-lang-group">[\s\S]*?<\/div>/g;

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (targetRegex.test(content)) {
      content = content.replace(targetRegex, '');
      fs.writeFileSync(file, content, 'utf-8');
      console.log('Removed arbor-lang-group from:', file);
    } else {
      console.log('arbor-lang-group not found in:', file);
    }
  }
}

