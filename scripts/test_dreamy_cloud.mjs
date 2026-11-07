import { chromium, devices } from 'playwright-core';

async function testMobileLiveFinal() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.goto('https://dreamy-cloud-4p9rgre.shipstatic.com/retail-spaces.html#Picker', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const grid = await page.$('#Picker');
  if (grid) {
    await grid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/dreamy_cloud_retail_mobile.png' });
    console.log('Saved dreamy_cloud_retail_mobile.png');
  }

  await browser.close();
}

testMobileLiveFinal().catch(err => {
  console.error(err);
  process.exit(1);
});

