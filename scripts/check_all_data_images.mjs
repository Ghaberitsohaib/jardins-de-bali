import fs from 'fs';
import path from 'path';

function checkJson(f) {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/"\/[^"]+\.(jpg|png|webp|svg|pdf|mp4)"/gi) || [];
  let missing = 0;
  matches.forEach(m => {
    const raw = m.slice(1, -1);
    if (!fs.existsSync('public' + raw)) {
      console.log('Missing from', f, ':', raw, 'in archive:', fs.existsSync('public_archive' + raw));
      missing++;
    }
  });
  console.log(f, 'done. Total missing:', missing);
}

checkJson('src/data/retail-spaces-data.json');
checkJson('src/data/apartments-data.json');
checkJson('src/data/apartments.json');

// Also scan all JS files in src/
function scanJs(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scanJs(full);
    else if (f.endsWith('.js')) {
      const c = fs.readFileSync(full, 'utf8');
      const matches = c.match(/['"]\/[^'"]+\.(jpg|png|webp|svg|pdf|mp4)['"]/gi) || [];
      matches.forEach(m => {
        const raw = m.slice(1, -1);
        if (!fs.existsSync('public' + raw)) {
          console.log('Missing from JS', full, ':', raw, 'in archive:', fs.existsSync('public_archive' + raw));
        }
      });
    }
  }
}
scanJs('src');
