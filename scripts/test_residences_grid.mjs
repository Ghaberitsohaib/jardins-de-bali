import { chromium } from 'playwright-core';

async function testResidences() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // Test dist directly
  await page.goto('http://localhost:4173/residences.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const picker = await page.$('#Picker');
  if (picker) {
    await picker.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/residences_grid_verified.png' });
    console.log('Saved residences_grid_verified.png');
  }

  await browser.close();
}

testResidences().catch(err => {
  console.error(err);
  process.exit(1);
});
