import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const idx = c.indexOf('arbor-inquire-btn');
  if (idx !== -1) {
    const tag = c.substring(c.lastIndexOf('<', idx), c.indexOf('>', idx) + 1);
    console.log(f, ':', tag);
  }
}

