import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('http://localhost:5173/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Scroll to #bizOptionsList
  await page.evaluate(() => {
    const el = document.getElementById('bizOptionsList');
    if (el) {
      el.scrollIntoView({ block: 'start' });
      window.scrollBy(0, -30);
    }
  });
  await page.waitForTimeout(600);

  // Capture initial (Wing A active)
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_index_biz_tab_wingA.png' });

  // Click on Retail (index 3)
  await page.evaluate(() => {
    const items = document.querySelectorAll('#BusinessSpacesOptions .biz-option-item');
    if (items[3]) items[3].click();
  });
  await page.waitForTimeout(500);

  // Capture Retail active
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_index_biz_tab_retail.png' });

  // Check collision bounding boxes
  const collisionCheck = await page.evaluate(() => {
    const panel3 = document.querySelector('.biz-detail-panel[data-index="3"]');
    const p = panel3 ? panel3.querySelector('p:last-child') : null;
    const btn = document.querySelector('#BusinessSpacesOptions a[href="/business.html"] button');
    if (!p || !btn) return null;
    const pRect = p.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    return {
      textBottom: pRect.bottom,
      buttonTop: btnRect.top,
      distance: btnRect.top - pRect.bottom,
      hasOverlap: btnRect.top < pRect.bottom
    };
  });
  console.log('Collision check result:', collisionCheck);

  await browser.close();
})();
