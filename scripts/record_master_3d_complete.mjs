import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const FFMPEG = 'c:\\Users\\ghabr\\Desktop\\immo\\node_modules\\ffmpeg-static\\ffmpeg.exe';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_DIR = 'c:\\Users\\ghabr\\Desktop\\immo\\temp_recordings_all';
const DESKTOP_VIDEO1 = 'C:\\Users\\ghabr\\Desktop\\VIDEO_3D_JARDINS_DE_BALI.mp4';
const DESKTOP_VIDEO2 = 'C:\\Users\\ghabr\\Desktop\\jardins_de_bali_3d_complet.mp4';
const BUREAU_FOLDER_VIDEO = 'C:\\Users\\ghabr\\Desktop\\bureau\\VIDEO_3D_JARDINS_DE_BALI.mp4';
const PUBLIC_VIDEO = 'c:\\Users\\ghabr\\Desktop\\immo\\public\\jardins_de_bali_3d_complet.mp4';

async function smoothMouseMove(page, fromX, fromY, toX, toY, steps = 25, delayMs = 15) {
  for (let i = 1; i <= steps; i++) {
    const x = fromX + (toX - fromX) * (i / steps);
    const y = fromY + (toY - fromY) * (i / steps);
    await page.mouse.move(x, y);
    await page.waitForTimeout(delayMs);
  }
}

async function smoothDrag(page, startX, startY, endX, endY, steps = 35, delayMs = 25) {
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    const x = startX + (endX - startX) * (i / steps);
    const y = startY + (endY - startY) * (i / steps);
    await page.mouse.move(x, y);
    await page.waitForTimeout(delayMs);
  }
  await page.mouse.up();
  await page.waitForTimeout(300);
}

// ==========================================
// SEGMENT 1: 3D MODEL & EXTERIOR
// ==========================================
async function recordSegment1() {
  console.log('=== [1/4] RECORDING SEGMENT 1: 3D MODEL & EXTERIOR ===');
  const dir = path.join(TEMP_DIR, 'seg1');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir, size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  const tStart = Date.now();
  console.log('Navigating to maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');

  console.log('Waiting for loader to hide and 3D textures to settle...');
  await page.waitForSelector('#viewerLoader', { state: 'hidden', timeout: 60000 });
  await page.waitForTimeout(22000); // 22s for full WebGL rendering

  const tActionStart = (Date.now() - tStart) / 1000 + 0.5;
  console.log(`Seg1 action start timestamp: ${tActionStart.toFixed(2)}s`);

  // 1. Aerial overview
  console.log('1. Aerial view...');
  await page.waitForTimeout(3000);

  const frame = page.frames().find(f => f.url().includes('vertex-france'));
  if (!frame) throw new Error('Vertex frame not found');

  // 2. Click TOITURE to zoom into building, street, and shops
  console.log('2. Clicking TOITURE...');
  const toitureBtn = await frame.$('text="TOITURE"');
  if (toitureBtn) {
    const box = await toitureBtn.boundingBox();
    await smoothMouseMove(page, 960, 540, box.x + box.width / 2, box.y + box.height / 2, 20, 15);
    await toitureBtn.click();
    await page.waitForTimeout(4000);
  }

  // 3. Smooth 360 orbit
  console.log('3. Smooth 360 orbit around building...');
  for (let s = 0; s < 4; s++) {
    await smoothDrag(page, 1250, 520, 650, 500, 40, 25);
    await page.waitForTimeout(800);
  }

  // 4. Click AÉRIEN
  console.log('4. Returning to AÉRIEN...');
  const aerienBtn = await frame.$('text="AÉRIEN"');
  if (aerienBtn) {
    const box = await aerienBtn.boundingBox();
    await smoothMouseMove(page, 960, 540, box.x + box.width / 2, box.y + box.height / 2, 20, 15);
    await aerienBtn.click();
    await page.waitForTimeout(3000);
  }

  // 5. Open top menu
  console.log('5. Demonstrating top floating navigation menu...');
  const menuBtn = await page.$('#mobileMenuToggle');
  if (menuBtn) {
    const box = await menuBtn.boundingBox();
    await smoothMouseMove(page, 960, 300, box.x + box.width / 2, box.y + box.height / 2, 20, 15);
    await menuBtn.click();
    await page.waitForTimeout(2500);
    await menuBtn.click();
    await page.waitForTimeout(1500);
  }

  // 6. Glide to bottom bar
  const planPill = await page.$('[data-vertex-mode="plan"]');
  if (planPill) {
    const box = await planPill.boundingBox();
    await smoothMouseMove(page, 960, 600, box.x + box.width / 2, box.y + box.height / 2, 25, 20);
    await page.waitForTimeout(1000);
  }

  const tActionEnd = (Date.now() - tStart) / 1000;
  console.log(`Seg1 action end timestamp: ${tActionEnd.toFixed(2)}s`);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  return { rawVideoPath: path.join(dir, files[0]), tActionStart, tActionEnd };
}

// ==========================================
// SEGMENT 2: LOCALISATION (MAP & CONTEXT)
// ==========================================
async function recordSegment2() {
  console.log('=== [2/4] RECORDING SEGMENT 2: LOCALISATION MAP ===');
  const dir = path.join(TEMP_DIR, 'seg2');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir, size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  const tStart = Date.now();
  console.log('Navigating to maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');

  // Switch to Localisation mode
  await page.waitForTimeout(2000);
  console.log('Clicking Localisation pill...');
  await page.click('[data-vertex-mode="plan"]');

  console.log('Waiting for loader to hide...');
  await page.waitForSelector('#viewerLoader', { state: 'hidden', timeout: 60000 });
  console.log('Loader hidden. Waiting 4s buffer for Google satellite map tiles...');
  await page.waitForTimeout(4000);

  const tActionStart = (Date.now() - tStart) / 1000 + 0.5;
  console.log(`Seg2 action start timestamp: ${tActionStart.toFixed(2)}s`);

  // 1. Initial wide satellite overview
  console.log('1. Appreciating satellite location view...');
  await page.waitForTimeout(2500);

  // 2. Smoothly move mouse over the central project pin 🏠
  console.log('2. Hovering over central project pin (Jardins de Bali)...');
  await smoothMouseMove(page, 960, 540, 960, 450, 25, 20); // Central pin location
  await page.waitForTimeout(1500);

  // 3. Move along Rue Ibn Batouta to Avenue Essaouira
  console.log('3. Tracing road network (Rue Ibn Batouta & Av. Essaouira)...');
  await smoothMouseMove(page, 960, 450, 400, 750, 35, 20); // Av. Essaouira / TotalEnergies
  await page.waitForTimeout(1500);

  // 4. Move over to the bottom right filter toggles (Education, Sante, Commerce, Transport)
  console.log('4. Hovering over POI filters...');
  await smoothMouseMove(page, 400, 750, 1600, 950, 35, 20); // Checkboxes area
  await page.waitForTimeout(1500);

  // 5. Glide to bottom navigation bar
  console.log('5. Gliding to bottom navigation bar...');
  await smoothMouseMove(page, 1600, 950, 960, 1030, 25, 20);
  await page.waitForTimeout(1500);

  const tActionEnd = (Date.now() - tStart) / 1000;
  console.log(`Seg2 action end timestamp: ${tActionEnd.toFixed(2)}s`);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  return { rawVideoPath: path.join(dir, files[0]), tActionStart, tActionEnd };
}

// ==========================================
// SEGMENT 3: GALERIE APPARTEMENTS
// ==========================================
async function recordSegment3() {
  console.log('=== [3/4] RECORDING SEGMENT 3: GALERIE SHOWCASE ===');
  const dir = path.join(TEMP_DIR, 'seg3');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir, size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  const tStart = Date.now();
  console.log('Navigating to maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');

  // Immediately click Galerie mode
  await page.waitForTimeout(2000);
  console.log('Clicking Galerie mode pill...');
  await page.click('[data-vertex-mode="gallery"]');

  console.log('Waiting for loader to hide...');
  await page.waitForSelector('#viewerLoader', { state: 'hidden', timeout: 60000 });
  console.log('Loader hidden. Waiting 4s buffer for all 9 high-res apartment images to be crisp...');
  await page.waitForTimeout(4000);

  const tActionStart = (Date.now() - tStart) / 1000 + 0.5;
  console.log(`Seg3 action start timestamp: ${tActionStart.toFixed(2)}s`);

  // 1. Initial wide appreciation of the 3x3 luxury apartment grid
  console.log('1. Appreciating 3x3 apartment gallery overview...');
  await page.waitForTimeout(2500);

  // 2. Smooth, graceful mouse hover across key interior renders
  // (without clicking into them, exactly as requested: "bla mat tdkhel her dakchi men lfo9")
  console.log('2. Smooth hover exploration across apartment renders...');
  
  // Top row - Living Room / Duplex Lounge
  await smoothMouseMove(page, 960, 540, 320, 220, 25, 20); // Top-left
  await page.waitForTimeout(1200);
  
  await smoothMouseMove(page, 320, 220, 960, 220, 30, 20); // Top-center (Duplex with stairs)
  await page.waitForTimeout(1200);

  await smoothMouseMove(page, 960, 220, 1600, 220, 30, 20); // Top-right (Modern salon)
  await page.waitForTimeout(1200);

  // Middle row - Dining & Kitchen
  await smoothMouseMove(page, 1600, 220, 960, 540, 30, 20); // Middle-center
  await page.waitForTimeout(1200);

  // Bottom row - Master Suite
  await smoothMouseMove(page, 960, 540, 1600, 850, 35, 20); // Bottom-right (Master bedroom)
  await page.waitForTimeout(1500);

  // Bottom navigation pill showcase
  await smoothMouseMove(page, 1600, 850, 960, 1030, 30, 20); // Bottom center pill
  await page.waitForTimeout(2000);

  const tActionEnd = (Date.now() - tStart) / 1000;
  console.log(`Seg3 action end timestamp: ${tActionEnd.toFixed(2)}s`);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  return { rawVideoPath: path.join(dir, files[0]), tActionStart, tActionEnd };
}

// ==========================================
// MASTER TRANSCODING & MULTI-XFADE
// ==========================================
async function master() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  const seg1 = await recordSegment1();
  const seg2 = await recordSegment2();
  const seg3 = await recordSegment3();

  console.log('=== [4/4] TRANSCODING & TRIMMING WITH FFMPEG (100% LOADER-FREE) ===');
  const seg1Trimmed = path.join(TEMP_DIR, 'seg1_trimmed.mp4');
  const seg2Trimmed = path.join(TEMP_DIR, 'seg2_trimmed.mp4');
  const seg3Trimmed = path.join(TEMP_DIR, 'seg3_trimmed.mp4');

  const dur1 = seg1.tActionEnd - seg1.tActionStart;
  const dur2 = seg2.tActionEnd - seg2.tActionStart;
  const dur3 = seg3.tActionEnd - seg3.tActionStart;

  console.log(`Seg1 dur: ${dur1.toFixed(2)}s | Seg2 dur: ${dur2.toFixed(2)}s | Seg3 dur: ${dur3.toFixed(2)}s`);

  // Trim Seg1
  const cmd1 = `"${FFMPEG}" -y -i "${seg1.rawVideoPath}" -ss ${seg1.tActionStart} -t ${dur1} -vf "scale=1920:1080:flags=lanczos,fps=60" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${seg1Trimmed}"`;
  execSync(cmd1, { stdio: 'inherit' });

  // Trim Seg2
  const cmd2 = `"${FFMPEG}" -y -i "${seg2.rawVideoPath}" -ss ${seg2.tActionStart} -t ${dur2} -vf "scale=1920:1080:flags=lanczos,fps=60" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${seg2Trimmed}"`;
  execSync(cmd2, { stdio: 'inherit' });

  // Trim Seg3
  const cmd3 = `"${FFMPEG}" -y -i "${seg3.rawVideoPath}" -ss ${seg3.tActionStart} -t ${dur3} -vf "scale=1920:1080:flags=lanczos,fps=60" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${seg3Trimmed}"`;
  execSync(cmd3, { stdio: 'inherit' });

  // Multi-xfade: Seg1 + Seg2 + Seg3
  const xfadeDur = 0.75;
  const offset1 = Math.max(0, dur1 - xfadeDur).toFixed(2);
  const offset2 = Math.max(0, parseFloat(offset1) + dur2 - xfadeDur).toFixed(2);

  console.log(`Applying 2 luxury crossfades: at ${offset1}s and at ${offset2}s...`);
  const filterComplex = `[0:v][1:v]xfade=transition=fade:duration=${xfadeDur}:offset=${offset1}[v01];[v01][2:v]xfade=transition=fade:duration=${xfadeDur}:offset=${offset2}[v]`;

  const finalCmd = `"${FFMPEG}" -y -i "${seg1Trimmed}" -i "${seg2Trimmed}" -i "${seg3Trimmed}" -filter_complex "${filterComplex}" -map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${DESKTOP_VIDEO1}"`;
  console.log('Executing final multi-merge to Desktop:', finalCmd);
  execSync(finalCmd, { stdio: 'inherit' });

  // Copy to all requested destinations
  fs.copyFileSync(DESKTOP_VIDEO1, DESKTOP_VIDEO2);
  fs.copyFileSync(DESKTOP_VIDEO1, BUREAU_FOLDER_VIDEO);
  fs.copyFileSync(DESKTOP_VIDEO1, PUBLIC_VIDEO);

  // Trigger Windows shell refresh
  try {
    execSync(`powershell -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.SendKeys]::SendWait('{F5}')"`, { stdio: 'ignore' });
  } catch (e) {}

  const stats = fs.statSync(DESKTOP_VIDEO1);
  console.log(`\n SUCCESS! Complete 3-in-1 video generated: ${DESKTOP_VIDEO1}`);
  console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

master().catch(err => {
  console.error('Master recording failed:', err);
  process.exit(1);
});

