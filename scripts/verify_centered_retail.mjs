import { chromium } from 'playwright-core';

async function verifyCentered() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  // 1440x900 viewport (standard laptop / desktop)
  const context1440 = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page1440 = await context1440.newPage();
  await page1440.goto('http://localhost:4173/retail-spaces.html#Picker', { waitUntil: 'networkidle' });
  await page1440.waitForTimeout(1000);

  const grid1440 = await page1440.$('#Picker');
  if (grid1440) {
    await grid1440.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(800);
    await page1440.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/retail_centered_1440.png' });
    console.log('Saved retail_centered_1440.png');
  }

  // 1920x1080 viewport (large desktop / monitor)
  const context1920 = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1.5
  });
  const page1920 = await context1920.newPage();
  await page1920.goto('http://localhost:4173/retail-spaces.html#Picker', { waitUntil: 'networkidle' });
  await page1920.waitForTimeout(1000);

  const grid1920 = await page1920.$('#Picker');
  if (grid1920) {
    await grid1920.scrollIntoViewIfNeeded();
    await page1920.waitForTimeout(800);
    await page1920.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/retail_centered_1920.png' });
    console.log('Saved retail_centered_1920.png');
  }

  await browser.close();
  console.log('All verification captures complete.');
}

verifyCentered().catch(err => {
  console.error(err);
  process.exit(1);
});

