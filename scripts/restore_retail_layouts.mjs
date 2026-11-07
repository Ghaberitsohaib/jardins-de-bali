import fs from 'fs';
import path from 'path';

const srcDir = 'public_archive/business/retail';
const destDir = 'public/business/retail';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(f => {
  const s = path.join(srcDir, f);
  const d = path.join(destDir, f);
  fs.copyFileSync(s, d);
  console.log(`Restored ${f} -> ${destDir}`);
});

// Also check business.js plan_05
let bJs = fs.readFileSync('src/business.js', 'utf8');
if (bJs.includes('/jardins_de_bali/plan_05_etage_courant.jpg')) {
  bJs = bJs.replace('/jardins_de_bali/plan_05_etage_courant.jpg', '/jardins_de_bali/plan_05_1er_etage.jpg');
  fs.writeFileSync('src/business.js', bJs, 'utf8');
  console.log('Fixed plan_05 in src/business.js');
}

