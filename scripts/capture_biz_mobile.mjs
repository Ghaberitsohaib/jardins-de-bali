import { chromium, devices } from 'playwright-core';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const el = await page.$('#BusinessSpaces');
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_spaces_mobile_current.png'
    });
  }

  // Also capture with fullPage or a few scrolls around it
  const box = await el.boundingBox();
  console.log('BusinessSpaces box:', box);

  await browser.close();
}

run();

