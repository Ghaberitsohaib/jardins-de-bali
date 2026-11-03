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
    console.log('Navigating to retail-spaces.html...');
    await page.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll to picker section
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(400);

    // 1. Open drawer
    await page.click('#mobileFilterTrigger');
    await page.waitForTimeout(400);

    const initMetrics = await page.evaluate(() => {
      const sheet = document.getElementById('mobileFilterSheet');
      const rect = sheet.getBoundingClientRect();
      return {
        height: rect.height,
        top: rect.top,
        isExpanded: sheet.classList.contains('is-expanded')
      };
    });
    console.log('Initial open metrics:', initMetrics);

    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_drag_1_initial.png' });

    // 2. Drag UP on filterDragHandle
    const handleBox = await page.locator('#filterDragHandle').boundingBox();
    console.log('Drag handle box:', handleBox);

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Drag UP by 100px
    await page.mouse.move(startX, startY - 120, { steps: 10 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(400);

    const expandedMetrics = await page.evaluate(() => {
      const sheet = document.getElementById('mobileFilterSheet');
      const rect = sheet.getBoundingClientRect();
      return {
        height: rect.height,
        top: rect.top,
        isExpanded: sheet.classList.contains('is-expanded')
      };
    });
    console.log('After drag UP (expanded) metrics:', expandedMetrics);

    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_drag_2_expanded.png' });

    // 3. Drag DOWN to collapse back to standard height
    const handleBox2 = await page.locator('#filterDragHandle').boundingBox();
    const startX2 = handleBox2.x + handleBox2.width / 2;
    const startY2 = handleBox2.y + handleBox2.height / 2;

    await page.mouse.move(startX2, startY2);
    await page.mouse.down();
    await page.mouse.move(startX2, startY2 + 60, { steps: 10 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(400);

    const collapsedMetrics = await page.evaluate(() => {
      const sheet = document.getElementById('mobileFilterSheet');
      const rect = sheet.getBoundingClientRect();
      return {
        height: rect.height,
        top: rect.top,
        isExpanded: sheet.classList.contains('is-expanded')
      };
    });
    console.log('After drag DOWN slightly (collapsed to standard) metrics:', collapsedMetrics);

    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_drag_3_collapsed.png' });

    // 4. Drag DOWN > 120px to dismiss
    const handleBox3 = await page.locator('#filterDragHandle').boundingBox();
    const startX3 = handleBox3.x + handleBox3.width / 2;
    const startY3 = handleBox3.y + handleBox3.height / 2;

    await page.mouse.move(startX3, startY3);
    await page.mouse.down();
    await page.mouse.move(startX3, startY3 + 180, { steps: 10 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(500);

    const dismissedState = await page.evaluate(() => {
      const drawer = document.getElementById('mobileFilterDrawer');
      return {
        isActive: drawer.classList.contains('is-active'),
        bodyOverflow: document.body.style.overflow
      };
    });
    console.log('After drag DOWN past threshold (dismissed):', dismissedState);

    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_drag_4_dismissed.png' });

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
})();

