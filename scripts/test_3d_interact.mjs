import { chromium } from 'playwright-core';

async function testInteractions() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('1. Loading maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');
  await page.waitForTimeout(22000); // Wait for full 3D load

  console.log('2. Taking ready screenshot...');
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_ready.png' });

  // Find vertex iframe
  const frame = page.frames().find(f => f.url().includes('vertex-france'));
  if (frame) {
    console.log('Frame URL:', frame.url());
    // Click on TOITURE button inside iframe if possible
    const toitureBtn = await frame.$('text="TOITURE"');
    console.log('Toiture button found:', !!toitureBtn);
    if (toitureBtn) {
      await toitureBtn.click();
      await page.waitForTimeout(4000);
      await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_toiture.png' });
    }
  }

  await browser.close();
  console.log('Finished interaction test.');
}

testInteractions().catch(console.error);

