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

  const opt = document => document.getElementById('BusinessSpacesOptions');

  const info = await page.evaluate(() => {
    const b = document.getElementById('BusinessSpaces');
    const o = document.getElementById('BusinessSpacesOptions');
    return {
      b: b ? { top: b.getBoundingClientRect().top + window.scrollY, h: b.offsetHeight } : null,
      o: o ? { top: o.getBoundingClientRect().top + window.scrollY, h: o.offsetHeight } : null
    };
  });

  console.log('Info:', info);

  // Take screenshot at start of BusinessSpaces
  await page.evaluate(y => window.scrollTo(0, y), info.b.top);
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/b_step0.png' });

  // Take screenshot at middle of BusinessSpaces
  await page.evaluate(y => window.scrollTo(0, y), info.b.top + 300);
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/b_step1.png' });

  // Take screenshot at start of BusinessSpacesOptions
  await page.evaluate(y => window.scrollTo(0, y), info.o.top);
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/b_step2.png' });

  // Take screenshot at middle of BusinessSpacesOptions
  await page.evaluate(y => window.scrollTo(0, y), info.o.top + 350);
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/b_step3.png' });

  await browser.close();
}

run();

