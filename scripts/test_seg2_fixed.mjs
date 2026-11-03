import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_DIR = 'c:\\Users\\ghabr\\Desktop\\immo\\temp_recordings\\seg2_test';

async function main() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const t0 = Date.now();
  console.log('1. Loading maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');
  await page.waitForTimeout(2000);

  console.log('2. Clicking Galerie mode...');
  await page.click('[data-vertex-mode="gallery"]');

  console.log('3. Waiting for loader to hide...');
  await page.waitForSelector('#viewerLoader', { state: 'hidden', timeout: 60000 });
  console.log('Loader hidden at:', ((Date.now() - t0) / 1000).toFixed(2), 'seconds');

  await page.waitForTimeout(4000); // 4s buffer to make sure images are crisp

  const screenshotPath = path.join(TEMP_DIR, 'galerie_verified_loaded.png');
  await page.screenshot({ path: screenshotPath });
  const stat = fs.statSync(screenshotPath);
  console.log('Screenshot saved, size:', (stat.size / (1024 * 1024)).toFixed(2), 'MB');

  await browser.close();
}

main().catch(console.error);

