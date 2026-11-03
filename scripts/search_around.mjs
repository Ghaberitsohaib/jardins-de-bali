import fs from 'fs';

const files = fs.readdirSync('scripts');
for (const f of files) {
  if (f.endsWith('.html') || f.endsWith('.js')) {
    const c = fs.readFileSync('scripts/' + f, 'utf8');
    if (c.includes('around') || c.includes('Around')) {
      console.log('Found around in scripts/' + f);
    }
  }
}

