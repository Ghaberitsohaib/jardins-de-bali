import fs from 'fs';
import path from 'path';

const backupDir = '_media_backup';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const files = [
  'public/jardins_de_bali_complet.mp4',
  'public/jardins_de_bali_presentation.webm',
  'public/jardins_de_bali_presentation.mp4',
  'public/jardins_de_bali_3d_experience.mp4',
  'public/jardins_de_bali_3d_complet.mp4',
  'public/official-hero.mp4',
  'public/gemini_generated_video_f58e469e.mp4',
  'public/amenities.mp4',
  'public/page@cea86f1338150f9a84e996dfce7af9bf.webm'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const dest = path.join(backupDir, path.basename(f));
    fs.renameSync(f, dest);
    console.log(`Moved ${f} -> ${dest}`);
  }
}

if (fs.existsSync('public/recordings')) {
  const destDir = path.join(backupDir, 'recordings');
  fs.renameSync('public/recordings', destDir);
  console.log('Moved public/recordings -> _media_backup/recordings');
}

if (fs.existsSync('public/audit')) {
  const destDir = path.join(backupDir, 'audit');
  fs.renameSync('public/audit', destDir);
  console.log('Moved public/audit -> _media_backup/audit');
}

console.log('Done moving dead media to backup.');
