import { chromium } from 'playwright-core';

async function testDesktop() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const b = await page.$('#BusinessSpaces');
  if (b) {
    await b.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_biz_spaces_before.png' });
  }

  const o = await page.$('#BusinessSpacesOptions');
  if (o) {
    await o.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_biz_options_before.png' });
  }

  await browser.close();
}

testDesktop();
