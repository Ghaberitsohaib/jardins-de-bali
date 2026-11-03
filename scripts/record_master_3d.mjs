import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const FFMPEG = 'c:\\Users\\ghabr\\Desktop\\immo\\node_modules\\ffmpeg-static\\ffmpeg.exe';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_DIR = 'c:\\Users\\ghabr\\Desktop\\immo\\temp_recordings';
const DESKTOP_OUTPUT = 'C:\\Users\\ghabr\\Desktop\\jardins_de_bali_3d_complet.mp4';
const PUBLIC_OUTPUT = 'c:\\Users\\ghabr\\Desktop\\immo\\public\\jardins_de_bali_3d_complet.mp4';

// Helper for smooth mouse move
async function smoothMouseMove(page, fromX, fromY, toX, toY, steps = 25, delayMs = 15) {
  for (let i = 1; i <= steps; i++) {
    const x = fromX + (toX - fromX) * (i / steps);
    const y = fromY + (toY - fromY) * (i / steps);
    await page.mouse.move(x, y);
    await page.waitForTimeout(delayMs);
  }
}

// Helper for smooth drag
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

async function recordSegment1() {
  console.log('=== [1/3] RECORDING SEGMENT 1: 3D MODEL & EXTERIOR ===');
  const seg1Dir = path.join(TEMP_DIR, 'seg1');
  if (fs.existsSync(seg1Dir)) fs.rmSync(seg1Dir, { recursive: true, force: true });
  fs.mkdirSync(seg1Dir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: seg1Dir, size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  const tPageStart = Date.now();
  console.log('Navigating to maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');

  console.log('Waiting for #viewerLoader to hide and 3D textures to settle...');
  await page.waitForSelector('#viewerLoader', { state: 'hidden', timeout: 60000 });
  await page.waitForTimeout(22000); // Wait for WebGL shaders, street textures, 3D model

  // Take verification screenshot of pristine ready state
  const verifyPath = path.join(TEMP_DIR, 'seg1_verified_ready.png');
  await page.screenshot({ path: verifyPath });
  const stat = fs.statSync(verifyPath);
  console.log(`Verification screenshot saved: seg1_verified_ready.png (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);

  // Exact time when recording actions start (ZERO LOADER)
  const tActionStart = (Date.now() - tPageStart) / 1000 + 0.5;
  console.log(`Action start timestamp: ${tActionStart.toFixed(2)}s`);

  // 1. Showcase high aerial overview (Boulevard M-16 / Marrakech context)
  console.log('1. Showcasing aerial perspective...');
  await page.waitForTimeout(3500);

  const frame = page.frames().find(f => f.url().includes('vertex-france'));
  if (!frame) throw new Error('Vertex France frame not found');

  // 2. Click TOITURE to focus down on the building, street, and shops
  console.log('2. Clicking TOITURE to zoom into building & commercial shops...');
  const toitureBtn = await frame.$('text="TOITURE"');
  if (toitureBtn) {
    const box = await toitureBtn.boundingBox();
    await smoothMouseMove(page, 960, 540, box.x + box.width / 2, box.y + box.height / 2, 20, 15);
    await toitureBtn.click();
    console.log('Clicked TOITURE, letting 3D camera swoop down...');
    await page.waitForTimeout(4500); // Camera zooms down smoothly
  }

  // 3. Smooth continuous 360-degree orbit around the building
  console.log('3. Performing smooth 360 orbit around the building...');
  for (let stroke = 0; stroke < 4; stroke++) {
    console.log(`  Orbit stroke ${stroke + 1}/4...`);
    await smoothDrag(page, 1250, 520, 650, 500, 45, 30);
    await page.waitForTimeout(1000);
  }

  // 4. Click AÉRIEN to zoom back out smoothly to district overview
  console.log('4. Clicking AÉRIEN for high vantage view...');
  const aerienBtn = await frame.$('text="AÉRIEN"');
  if (aerienBtn) {
    const box = await aerienBtn.boundingBox();
    await smoothMouseMove(page, 960, 540, box.x + box.width / 2, box.y + box.height / 2, 20, 15);
    await aerienBtn.click();
    await page.waitForTimeout(3500);
  }

  // 5. Open top floating menu to display luxury navigation
  console.log('5. Demonstrating top floating navigation menu...');
  const menuBtn = await page.$('#mobileMenuToggle');
  if (menuBtn) {
    const box = await menuBtn.boundingBox();
    await smoothMouseMove(page, 960, 300, box.x + box.width / 2, box.y + box.height / 2, 20, 15);
    await menuBtn.click();
    await page.waitForTimeout(2500); // Showcase opened luxury menu
    await menuBtn.click(); // Close
    await page.waitForTimeout(1500);
  }

  // 6. Smoothly glide cursor to bottom navigation bar
  console.log('6. Gliding to bottom navigation bar...');
  const galPill = await page.$('[data-vertex-mode="gallery"]');
  if (galPill) {
    const box = await galPill.boundingBox();
    await smoothMouseMove(page, 960, 600, box.x + box.width / 2, box.y + box.height / 2, 25, 20);
    await page.waitForTimeout(1500);
  }

  const tActionEnd = (Date.now() - tPageStart) / 1000;
  console.log(`Action end timestamp: ${tActionEnd.toFixed(2)}s`);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(seg1Dir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('No webm video recorded for Segment 1');
  const rawVideoPath = path.join(seg1Dir, files[0]);

  return { rawVideoPath, tActionStart, tActionEnd };
}

async function recordSegment2() {
  console.log('=== [2/3] RECORDING SEGMENT 2: GALERIE SHOWCASE ===');
  const seg2Dir = path.join(TEMP_DIR, 'seg2');
  if (fs.existsSync(seg2Dir)) fs.rmSync(seg2Dir, { recursive: true, force: true });
  fs.mkdirSync(seg2Dir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: seg2Dir, size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  const tPageStart = Date.now();
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

  // Take verification screenshot
  const verifyPath = path.join(TEMP_DIR, 'seg2_verified_ready.png');
  await page.screenshot({ path: verifyPath });
  const stat = fs.statSync(verifyPath);
  console.log(`Verification screenshot saved: seg2_verified_ready.png (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);

  const tActionStart = (Date.now() - tPageStart) / 1000 + 0.5;
  console.log(`Galerie action start timestamp: ${tActionStart.toFixed(2)}s`);

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

  const tActionEnd = (Date.now() - tPageStart) / 1000;
  console.log(`Galerie action end timestamp: ${tActionEnd.toFixed(2)}s`);

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(seg2Dir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) throw new Error('No webm video recorded for Segment 2');
  const rawVideoPath = path.join(seg2Dir, files[0]);

  return { rawVideoPath, tActionStart, tActionEnd };
}

async function master() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  const seg1 = await recordSegment1();
  const seg2 = await recordSegment2();

  console.log('=== [3/3] TRANSCODING & TRIMMING WITH FFMPEG (100% LOADER-FREE) ===');
  const seg1Trimmed = path.join(TEMP_DIR, 'seg1_trimmed.mp4');
  const seg2Trimmed = path.join(TEMP_DIR, 'seg2_trimmed.mp4');

  const seg1Dur = seg1.tActionEnd - seg1.tActionStart;
  const seg2Dur = seg2.tActionEnd - seg2.tActionStart;

  console.log(`Segment 1 duration: ${seg1Dur.toFixed(2)}s (starts at ${seg1.tActionStart.toFixed(2)}s)`);
  console.log(`Segment 2 duration: ${seg2Dur.toFixed(2)}s (starts at ${seg2.tActionStart.toFixed(2)}s)`);

  // Trim Segment 1 (exact frame-accurate output seek, zero loader)
  const cmd1 = `"${FFMPEG}" -y -i "${seg1.rawVideoPath}" -ss ${seg1.tActionStart} -t ${seg1Dur} -vf "scale=1920:1080:flags=lanczos,fps=60" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${seg1Trimmed}"`;
  console.log('Executing:', cmd1);
  execSync(cmd1, { stdio: 'inherit' });

  // Trim Segment 2 (exact frame-accurate output seek, zero loader)
  const cmd2 = `"${FFMPEG}" -y -i "${seg2.rawVideoPath}" -ss ${seg2.tActionStart} -t ${seg2Dur} -vf "scale=1920:1080:flags=lanczos,fps=60" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${seg2Trimmed}"`;
  console.log('Executing:', cmd2);
  execSync(cmd2, { stdio: 'inherit' });

  // Crossfade transition between Segment 1 and Segment 2
  const xfadeDur = 0.75;
  const offset = Math.max(0, seg1Dur - xfadeDur).toFixed(2);
  console.log(`Applying luxury 0.75s crossfade dissolve at offset ${offset}s...`);

  const xfadeCmd = `"${FFMPEG}" -y -i "${seg1Trimmed}" -i "${seg2Trimmed}" -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${xfadeDur}:offset=${offset}[v]" -map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p "${DESKTOP_OUTPUT}"`;
  console.log('Executing xfade merge to Desktop:', xfadeCmd);
  execSync(xfadeCmd, { stdio: 'inherit' });

  // Also copy to public directory
  fs.copyFileSync(DESKTOP_OUTPUT, PUBLIC_OUTPUT);

  const stats = fs.statSync(DESKTOP_OUTPUT);
  console.log(`\n SUCCESS! Master video generated: ${DESKTOP_OUTPUT}`);
  console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

master().catch(err => {
  console.error('Master recording failed:', err);
  process.exit(1);
});
