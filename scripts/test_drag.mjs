import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:5173/maquette3d.html');
  console.log('Waiting 23s for full 3D load...');
  await page.waitForTimeout(23000);

  const frame = page.frames().find(f => f.url().includes('vertex-france'));
  console.log('Found frame:', !!frame);

  const canvas = await frame.$('canvas');
  console.log('Found canvas:', !!canvas);
  const box = await canvas.boundingBox();
  console.log('Canvas box:', box);

  // Click TOITURE first
  const toitureBtn = await frame.$('text="TOITURE"');
  if (toitureBtn) {
    await toitureBtn.click();
    console.log('Clicked TOITURE');
    await page.waitForTimeout(4000);
  }

  // Smooth drag to rotate view
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  console.log('Starting smooth mouse drag rotation...');
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let i = 0; i <= 40; i++) {
    await page.mouse.move(startX - i * 8, startY - i * 1, { steps: 2 });
    await page.waitForTimeout(40);
  }
  await page.mouse.up();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_drag.png' });
  console.log('Screenshot saved to test_drag.png');

  await browser.close();
}

main().catch(console.error);

