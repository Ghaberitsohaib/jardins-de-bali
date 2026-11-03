import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const colors = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    const trigger = el ? el.querySelector('.trigger') : null;
    return {
      elBg: el ? window.getComputedStyle(el).backgroundColor : null,
      triggerBg: trigger ? window.getComputedStyle(trigger).backgroundColor : null,
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
    };
  });
  console.log('Belgrade Amenities colors:', colors);

  await browser.close();
}

main().catch(console.error);

