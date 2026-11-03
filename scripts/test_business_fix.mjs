import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  // ==========================================
  // MOBILE TEST (393 x 852)
  // ==========================================
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('http://localhost:5173/business.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Scroll to BusinessSpacesOptions
  await page.evaluate(() => {
    const el = document.getElementById('BusinessSpacesOptions');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);

  // Screenshot 1: Mobile initial (Flagship Stores RDC)
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_biz_mobile_flagship.png' });

  // Click on Bureaux & Suites (Tab 2)
  await page.evaluate(() => {
    const items = document.querySelectorAll('#BusinessSpacesOptions .biz-option-item');
    if (items[2]) items[2].click();
  });
  await page.waitForTimeout(400);

  // Screenshot 2: Mobile Bureaux & Suites active
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_biz_mobile_bureaux.png' });

  // Check metrics and distances
  const metrics = await page.evaluate(() => {
    const sec = document.getElementById('BusinessSpacesOptions');
    const pano = document.getElementById('Panorama');
    const imgCol = sec.querySelector('.retail-spaces-reveal-image');
    const contentCol = sec.querySelector('.retail-spaces-reveal-content');
    const btn = document.getElementById('bizBlueprintBtn');
    const panel2 = sec.querySelector('.biz-detail-panel[data-index="2"]');
    const p = panel2 ? panel2.querySelector('.biz-panel-desc') : null;

    const imgRect = imgCol ? imgCol.getBoundingClientRect() : null;
    const contentRect = contentCol ? contentCol.getBoundingClientRect() : null;
    const panoRect = pano ? pano.getBoundingClientRect() : null;
    const pRect = p ? p.getBoundingClientRect() : null;
    const btnRect = btn ? btn.getBoundingClientRect() : null;

    return {
      gapBetweenImgAndContent: contentRect && imgRect ? contentRect.top - imgRect.bottom : null,
      gapBetweenSecAndPanorama: panoRect && sec ? panoRect.top - sec.getBoundingClientRect().bottom : null,
      distanceTextToButton: btnRect && pRect ? btnRect.top - pRect.bottom : null,
      secHeight: sec ? sec.offsetHeight : null,
      contentHeight: contentCol ? contentCol.offsetHeight : null
    };
  });
  console.log('Mobile Metrics:', metrics);

  // Scroll slightly down to see transition to Panorama
  await page.evaluate(() => window.scrollBy(0, 350));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_biz_mobile_transition_pano.png' });

  // ==========================================
  // DESKTOP TEST (1440 x 900)
  // ==========================================
  const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesk.goto('http://localhost:5173/business.html', { waitUntil: 'domcontentloaded' });
  await pageDesk.waitForTimeout(600);
  await pageDesk.evaluate(() => {
    const el = document.getElementById('BusinessSpacesOptions');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await pageDesk.waitForTimeout(600);
  await pageDesk.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_biz_desktop_final.png' });

  await browser.close();
  console.log('All tests completed successfully!');
})();

