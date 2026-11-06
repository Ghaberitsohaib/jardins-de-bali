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

const targetPattern = /<div class="arbor-lang-group">[\s\S]*?<\/div>/;
const replacement = `<div class="arbor-lang-group">
              <a href="#top" class="arbor-lang-item is-active">FR</a>
              <a href="#top" class="arbor-lang-item">EN</a>
              <a href="#top" class="arbor-lang-item">AR</a>
            </div>`;

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    if (targetPattern.test(content)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(file, content, 'utf-8');
      console.log('Updated language group in:', file);
    }
  }
}
