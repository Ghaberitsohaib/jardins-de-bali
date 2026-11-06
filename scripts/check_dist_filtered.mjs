import fs from 'fs';
import path from 'path';

function getDirSize(dir, exclude = []) {
  let size = 0;
  let files = [];
  function walk(current) {
    const list = fs.readdirSync(current);
    for (const item of list) {
      const full = path.join(current, item);
      const rel = path.relative(dir, full).replace(/\\/g, '/');
      if (exclude.some(ex => rel === ex || rel.startsWith(ex + '/'))) continue;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        size += stat.size;
        files.push({ path: rel, size: stat.size });
      }
    }
  }
  walk(dir);
  return { size, files };
}

const unusedRootFiles = [
  'jardins_de_bali_complet.mp4',
  'jardins_de_bali_presentation.webm',
  'jardins_de_bali_presentation.mp4',
  'jardins_de_bali_3d_experience.mp4',
  'jardins_de_bali_3d_complet.mp4',
  'official-hero.mp4',
  'gemini_generated_video_f58e469e.mp4',
  'gemini_generated_video_8ad1fff9.mp4',
  'test-map-screenshot.png',
  'audit',
  'recordings'
];

const { size, files } = getDirSize('dist', unusedRootFiles);
console.log('Filtered dist size:', (size / (1024 * 1024)).toFixed(2), 'MB');
console.log('Top 10 largest files in filtered dist:');
files.sort((a, b) => b.size - a.size).slice(0, 10).forEach(f => {
  console.log(` - ${f.path}: ${(f.size / (1024 * 1024)).toFixed(2)} MB`);
});
