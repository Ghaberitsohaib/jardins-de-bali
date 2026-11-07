import { chromium } from 'playwright-core';

async function testLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('https://auroral-drive-t76u6ha.shipstatic.com/retail-spaces.html#Picker', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const grid = await page.$('#Picker');
  if (grid) {
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_centered_verified.png' });
    console.log('Saved live_centered_verified.png');
  }

  await browser.close();
}

testLive().catch(err => {
  console.error(err);
  process.exit(1);
});

