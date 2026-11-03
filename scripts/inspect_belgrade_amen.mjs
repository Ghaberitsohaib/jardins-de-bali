import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const amenTop = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  await page.evaluate(y => window.scrollTo(0, y), amenTop);
  await page.waitForTimeout(1000);

  const amenLive = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    const bg = el.querySelector('.background');
    return {
      outerHTML: el.outerHTML.substring(0, 1000),
      rect: el.getBoundingClientRect(),
      bgRect: bg ? bg.getBoundingClientRect() : null,
      bgStyle: bg ? {
        className: bg.className,
        inlineStyle: bg.getAttribute('style'),
        top: window.getComputedStyle(bg).top,
        transform: window.getComputedStyle(bg).transform,
      } : null
    };
  });
  console.log('Belgrade Amenities Live:', JSON.stringify(amenLive, null, 2));

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_amenities_desktop.png' });

  await browser.close();
}

main().catch(console.error);

