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
    // 1. Visit page
    await page.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Screenshot 1: At Hero (scroll 0) - pristine hero!
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_1_hero_clean.png' });

    // 2. Scroll into Picker section
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(500);

    // Screenshot 2: Floating pill appeared at bottom
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_2_floating_pill.png' });

    // 3. Click the FILTRES floating pill
    await page.click('#mobileFilterTrigger');
    await page.waitForTimeout(500);

    // Screenshot 3: Drawer opened full screen/slide-over
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_3_drawer_open.png' });

    // 4. Click Bureaux filter inside drawer
    await page.locator('#mobileFilterDrawer button[data-filter-type="Offices"]').click();
    await page.waitForTimeout(300);

    // Screenshot 4: Drawer with filter selected
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_4_drawer_offices.png' });

    // 5. Click "Afficher les résultats"
    await page.click('#applyMobileFilterBtn');
    await page.waitForTimeout(600);

    // Screenshot 5: Back to page, drawer closed, showing filtered offices
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_5_filtered_grid.png' });

    console.log('ALL VERIFICATION SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error in verification:', err);
  } finally {
    await browser.close();
  }
})();
