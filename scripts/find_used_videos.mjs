import fs from 'fs';
import path from 'path';

const codeFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'))
  .concat(fs.readdirSync('src').map(f => path.join('src', f)));

const usedMedia = new Set();
for (const cf of codeFiles) {
  if (fs.statSync(cf).isFile()) {
    const content = fs.readFileSync(cf, 'utf8');
    const matches = content.matchAll(/["'`/][a-zA-Z0-9_\-./]+\.(mp4|webm|jpg|jpeg|png|webp|svg)/gi);
    for (const m of matches) {
      usedMedia.add(m[0].replace(/^["'`]/, ''));
    }
  }
}

console.log('USED VIDEOS:');
Array.from(usedMedia)
  .filter(m => m.endsWith('.mp4') || m.endsWith('.webm'))
  .forEach(v => console.log(' - ', v));

