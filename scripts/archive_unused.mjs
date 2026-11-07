import fs from 'fs';
import path from 'path';

const dirs = ['videos_archive', 'audit_archive'];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const unused = [
  'jardins_de_bali_complet.mp4',
  'jardins_de_bali_presentation.webm',
  'jardins_de_bali_presentation.mp4',
  'jardins_de_bali_3d_experience.mp4',
  'jardins_de_bali_3d_complet.mp4',
  'official-hero.mp4',
  'gemini_generated_video_f58e469e.mp4',
  'gemini_generated_video_8ad1fff9.mp4',
  'test-map-screenshot.png'
];

for (const f of unused) {
  const src = path.join('public', f);
  const dst = path.join('videos_archive', f);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst);
    console.log(`Moved ${f} to videos_archive/`);
  }
}

if (fs.existsSync('public/audit')) {
  fs.renameSync('public/audit', 'audit_archive/audit');
  console.log('Moved public/audit to audit_archive/audit');
}
if (fs.existsSync('public/recordings')) {
  fs.renameSync('public/recordings', 'audit_archive/recordings');
  console.log('Moved public/recordings to audit_archive/recordings');
}

console.log('Archive complete.');

