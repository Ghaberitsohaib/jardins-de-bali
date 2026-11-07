import { chromium, devices } from 'playwright-core';

async function testHero() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  // iPhone 14 Pro
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.goto('http://localhost:4173/business.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_hero_centered_iphone14.png' });
  console.log('Saved business_hero_centered_iphone14.png');

  // Also iPhone SE (smaller screen: 375x667)
  const contextSE = await browser.newContext({
    ...devices['iPhone SE'],
    deviceScaleFactor: 2
  });
  const pageSE = await contextSE.newPage();
  await pageSE.goto('http://localhost:4173/business.html', { waitUntil: 'networkidle' });
  await pageSE.waitForTimeout(1000);

  await pageSE.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_hero_centered_iphoneSE.png' });
  console.log('Saved business_hero_centered_iphoneSE.png');

  await browser.close();
}

testHero().catch(err => {
  console.error(err);
  process.exit(1);
});

