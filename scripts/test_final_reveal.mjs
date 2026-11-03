import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const amenTop = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  await page.evaluate(y => window.scrollTo(0, y), amenTop);
  await page.waitForTimeout(2500);

  const clip = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    const trigger = el.querySelector('.trigger');
    return window.getComputedStyle(trigger).clipPath;
  });
  console.log('Final clip after 2.5s:', clip);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_amenities_fully_revealed.png' });
  await browser.close();
}

main().catch(console.error);

