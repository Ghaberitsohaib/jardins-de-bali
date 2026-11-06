import { chromium } from 'playwright-core';

async function checkRule() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');

  const res = await page.evaluate(() => {
    const el = document.querySelector('.res-item-primary.-translate-y-full');
    if (!el) return 'el not found';
    const computed = window.getComputedStyle(el);
    return {
      transform: computed.transform,
      translate: computed.translate,
      styleAttr: el.getAttribute('style'),
      matchingRules: Array.from(document.styleSheets).flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules).filter(r => r.selectorText && r.selectorText.includes('-translate-y-full')).map(r => r.cssText);
        } catch (e) {
          return [];
        }
      })
    };
  });

  console.log(JSON.stringify(res, null, 2));
  await browser.close();
}

checkRule();

