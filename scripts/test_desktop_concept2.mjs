import { chromium } from 'playwright-core';

async function testDesktop() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const bizHero = page.locator('#BusinessSpaces');
  await bizHero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_desktop_hero.png' });

  const bizOptions = page.locator('#BusinessSpacesOptions');
  await bizOptions.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_desktop_options.png' });

  await browser.close();
  console.log('Desktop verification finished.');
}

testDesktop().catch(err => {
  console.error(err);
  process.exit(1);
});

