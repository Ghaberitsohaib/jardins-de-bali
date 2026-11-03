import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Trigger reveal
  await page.evaluate(() => {
    window.scrollBy(0, 50);
  });
  await page.waitForTimeout(1800);

  // Screenshot desktop hero
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_hero_baytimmo.png' });

  await browser.close();
  console.log('Desktop screenshot captured successfully.');
}

main().catch(console.error);

