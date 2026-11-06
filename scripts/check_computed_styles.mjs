import { chromium } from 'playwright-core';

async function checkStyles() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const page = await mobCtx.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.res-option-item'));
    return items.map((it, idx) => {
      const p = it.querySelector('.res-item-primary');
      const s = it.querySelector('.res-item-italic');
      return {
        idx,
        itemClasses: it.className,
        primaryClasses: p?.className,
        primaryTransform: p ? window.getComputedStyle(p).transform : null,
        italicClasses: s?.className,
        italicTop: s ? window.getComputedStyle(s).top : null,
        italicPosition: s ? window.getComputedStyle(s).position : null,
      };
    });
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

checkStyles();

