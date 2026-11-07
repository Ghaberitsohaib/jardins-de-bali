import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') scanDir(full);
    } else if (f.endsWith('.js') || f.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (
          line.includes('Inquire') ||
          line.includes('Explore in 3d') ||
          line.includes('All Rights Reserved') ||
          line.includes('Installment plan') ||
          line.includes('JOIN THE WORLD') ||
          line.includes('units available')
        ) {
          console.log(`${full}:${i+1}: ${line.trim()}`);
        }
      });
    }
  }
}

scanDir('src');
