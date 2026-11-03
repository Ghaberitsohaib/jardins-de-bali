import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const aroundInfo = await page.evaluate(() => {
    const el = document.getElementById('Around') || document.getElementById('around');
    if (!el) return 'Not found';
    return {
      id: el.id,
      className: el.className,
      outerHTML: el.outerHTML.substring(0, 500)
    };
  });
  console.log('Around info from live site:', aroundInfo);

  // Also let's check Amenities on live site
  const amenInfo = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    if (!el) return 'Not found';
    const rect = el.getBoundingClientRect();
    const prev = el.previousElementSibling;
    return {
      id: el.id,
      className: el.className,
      rect,
      prevId: prev ? prev.id : null,
      prevClass: prev ? prev.className : null,
      bgImg: el.querySelector('.background') ? {
        className: el.querySelector('.background').className,
        rect: el.querySelector('.background').getBoundingClientRect(),
        computedTop: window.getComputedStyle(el.querySelector('.background')).top,
        computedTransform: window.getComputedStyle(el.querySelector('.background')).transform
      } : null
    };
  });
  console.log('Amenities info from live site:', JSON.stringify(amenInfo, null, 2));

  await browser.close();
}

main().catch(console.error);

