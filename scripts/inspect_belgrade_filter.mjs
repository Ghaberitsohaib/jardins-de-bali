import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  try {
    await page.goto('https://belgradearbor.rs/en/retail-spaces', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(1000);
    const btn = await page.locator('button:has-text("FILTERS")').first();
    await btn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_filter_modal.png' });
    
    const modalData = await page.evaluate(() => {
      // Find visible elements with high z-index
      const all = Array.from(document.querySelectorAll('*'));
      const highZ = all.filter(el => {
        const s = window.getComputedStyle(el);
        return (parseInt(s.zIndex) > 30 || s.position === 'fixed') && s.display !== 'none' && s.visibility !== 'hidden' && el.offsetHeight > 200;
      });
      return highZ.map(el => ({ tag: el.tagName, class: el.className, text: el.innerText.substring(0, 100) }));
    });
    console.log('Modal data:', JSON.stringify(modalData, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();

