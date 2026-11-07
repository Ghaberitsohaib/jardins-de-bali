import { chromium, devices } from 'playwright-core';

async function testMobileRetailLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 3
  });
  const page = await context.newPage();

  // Test current live site
  await page.goto('https://auric-process-vgeas43.shipstatic.com/retail-spaces.html#Picker', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const grid = await page.$('#Picker');
  if (grid) {
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_mobile_retail_check.png' });
    console.log('Saved live_mobile_retail_check.png');
  }

  await browser.close();
}

testMobileRetailLive().catch(err => {
  console.error(err);
  process.exit(1);
});

