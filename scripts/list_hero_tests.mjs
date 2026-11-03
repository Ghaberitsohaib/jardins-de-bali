import fs from 'fs';

const files = fs.readdirSync('scripts');
for (const f of files) {
  if (f.startsWith('test_hero') || f.includes('hero')) {
    console.log(f);
    const c = fs.readFileSync('scripts/' + f, 'utf8');
    console.log(c.substring(0, 300));
  }
}

