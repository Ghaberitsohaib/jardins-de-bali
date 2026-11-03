import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 }
  });

  try {
    await page.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll to picker
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(500);

    // Click filter trigger to open the sheet
    await page.click('#mobileFilterTrigger');
    await page.waitForTimeout(500);

    // Select Retail / Magasins
    await page.locator('#mobileFilterDrawer button[data-filter-type="Retail"]').click();
    await page.waitForTimeout(300);

    // Select Wing A
    await page.locator('#mobileFilterDrawer button[data-filter-wing="Wing A"]').click();
    await page.waitForTimeout(300);

    // Click apply
    await page.click('#applyMobileFilterBtn');
    await page.waitForTimeout(600);

    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_results_applied.png' });
    const count = await page.evaluate(() => document.querySelectorAll('#retailGrid .retail-card-item').length);
    console.log('Filtered card count on grid:', count);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
