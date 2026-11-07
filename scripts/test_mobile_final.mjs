import { chromium, devices } from 'playwright-core';

async function testMobile() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4173/retail-spaces.html#Picker', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const grid = await page.$('#Picker');
  if (grid) {
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/retail_mobile_final_check.png' });
    console.log('Saved retail_mobile_final_check.png');
  }

  await browser.close();
}

testMobile().catch(err => {
  console.error(err);
  process.exit(1);
});

