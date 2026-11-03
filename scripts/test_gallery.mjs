import { chromium } from 'playwright-core';

async function testGallery() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:5173/maquette3d.html');
  await page.waitForTimeout(5000);
  await page.click('[data-vertex-mode="gallery"]');
  await page.waitForTimeout(10000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/inspect_gallery_ready.png' });
  await browser.close();
  console.log('Saved inspect_gallery_ready.png');
}

testGallery().catch(console.error);

