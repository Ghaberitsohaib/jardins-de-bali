import { chromium, devices } from 'playwright-core';

async function testLiveBusiness() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.goto('https://auric-process-vgeas43.shipstatic.com/business.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_business_centered_verified.png' });
  console.log('Saved live_business_centered_verified.png');

  await browser.close();
}

testLiveBusiness().catch(err => {
  console.error(err);
  process.exit(1);
});

