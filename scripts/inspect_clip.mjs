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
  await page.waitForTimeout(1000);

  const clipInfo = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    const trigger = el.querySelector('.trigger');
    const bg = el.querySelector('.background');
    return {
      triggerClip: window.getComputedStyle(trigger).clipPath,
      bgClip: window.getComputedStyle(bg).clipPath,
      triggerWidth: trigger.clientWidth,
      triggerScrollWidth: trigger.scrollWidth,
      triggerStyle: trigger.getAttribute('style'),
      bgWidth: bg.clientWidth,
      bgNaturalWidth: bg.naturalWidth,
      bgNaturalHeight: bg.naturalHeight
    };
  });
  console.log('Clip Info:', JSON.stringify(clipInfo, null, 2));

  await browser.close();
}

main().catch(console.error);

