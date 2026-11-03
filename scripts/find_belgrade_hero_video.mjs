import fs from 'fs';

const files = fs.readdirSync('scripts');
for (const f of files) {
  if (f.endsWith('.js') || f.endsWith('.html')) {
    const c = fs.readFileSync('scripts/' + f, 'utf8');
    if (c.includes('hero.mp4') || c.includes('hero-m.webm')) {
      console.log('Found hero video in', f);
      let idx = c.indexOf('hero');
      while (idx !== -1) {
        console.log(c.substring(Math.max(0, idx - 100), idx + 200));
        idx = c.indexOf('hero', idx + 1);
      }
    }
  }
}

