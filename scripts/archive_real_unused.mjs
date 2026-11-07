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
const archiveBase = 'public_archive';
if (!fs.existsSync(archiveBase)) fs.mkdirSync(archiveBase, { recursive: true });

let movedCount = 0;
let movedBytes = 0;

// Essential files that must never be archived even if not mentioned by name
const keepAlways = new Set([
  'favicon.ico',
  'favicon.svg',
  'favicon.png',
  'apple-touch-icon.png'
]);

for (const pf of allPublic) {
  const rel = path.relative('public', pf).replace(/\\/g, '/');
  const basename = path.basename(pf);
  if (keepAlways.has(basename)) continue;

  let isUsed = false;
  for (const c of codeContents) {
    if (c.content.includes(rel) || c.content.includes(basename)) {
      isUsed = true;
      break;
    }
  }

  if (!isUsed) {
    const target = path.join(archiveBase, rel);
    const targetDir = path.dirname(target);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    const s = fs.statSync(pf).size;
    fs.renameSync(pf, target);
    movedCount++;
    movedBytes += s;
  }
}

console.log(`Archived ${movedCount} unused files (${(movedBytes / (1024*1024)).toFixed(2)} MB) to public_archive/`);

