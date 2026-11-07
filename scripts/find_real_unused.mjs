import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

const codeFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'))
  .concat(fs.readdirSync('src').map(f => path.join('src', f)).filter(f => fs.statSync(f).isFile()));

const codeContents = codeFiles.map(f => ({ path: f, content: fs.readFileSync(f, 'utf8') }));

const allPublic = walk('public');
let unused = [];
let unusedSize = 0;

for (const pf of allPublic) {
  const rel = path.relative('public', pf).replace(/\\/g, '/');
  const basename = path.basename(pf);
  let isUsed = false;
  for (const c of codeContents) {
    if (c.content.includes(rel) || c.content.includes(basename)) {
      isUsed = true;
      break;
    }
  }
  if (!isUsed) {
    const s = fs.statSync(pf).size;
    unused.push({ rel, size: (s / (1024*1024)).toFixed(2), bytes: s });
    unusedSize += s;
  }
}

console.log('REAL UNUSED IN PUBLIC:', (unusedSize / (1024*1024)).toFixed(2), 'MB');
unused.sort((a,b) => b.bytes - a.bytes).forEach(u => console.log(' -', u.size, 'MB |', u.rel));

