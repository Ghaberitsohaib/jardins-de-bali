import { chromium, devices } from 'playwright-core';

async function verifyAll() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // 1. MOBILE VERIFICATION
  const iPhone = devices['iPhone 14 Pro'];
  const mobileCtx = await browser.newContext({
    ...iPhone,
    deviceScaleFactor: 2
  });
  const mPage = await mobileCtx.newPage();
  await mPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(1000);

  // Scroll to #BusinessSpaces
  const bEl = await mPage.$('#BusinessSpaces');
  if (bEl) {
    await bEl.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(500);
    await mPage.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_hero_mobile_final.png'
    });
  }

  // Scroll down to where the user had the issue (transition + #BusinessSpacesOptions)
  await mPage.evaluate(() => window.scrollBy(0, 380));
  await mPage.waitForTimeout(500);
  await mPage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_scroll_mobile_final.png'
  });

  // Scroll to #BusinessSpacesOptions
  const optEl = await mPage.$('#BusinessSpacesOptions');
  if (optEl) {
    await optEl.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(500);
    await mPage.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_options_mobile_final.png'
    });

    // Test clicking "Retail" option item (index 3)
    const options = await mPage.$$('#BusinessSpacesOptions .biz-option-item');
    console.log(`Found ${options.length} options on mobile`);
    if (options[3]) {
      await options[3].click();
      await mPage.waitForTimeout(400);

      const activeText = await mPage.evaluate(() => {
        const active = document.querySelector('#BusinessSpacesOptions .biz-detail-panel.is-active');
        return active ? active.innerText : null;
      });
      console.log('Mobile active panel after clicking Retail:', activeText);

      await mPage.screenshot({
        path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_retail_click_mobile.png'
      });
    }
  }

  // 2. DESKTOP VERIFICATION
  const deskCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5
  });
  const dPage = await deskCtx.newPage();
  await dPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(1000);

  const dBEl = await dPage.$('#BusinessSpaces');
  if (dBEl) {
    await dBEl.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(500);
    await dPage.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_hero_desktop_final.png'
    });
  }

  const dOptEl = await dPage.$('#BusinessSpacesOptions');
  if (dOptEl) {
    await dOptEl.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(500);
    await dPage.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_options_desktop_final.png'
    });

    // Test clicking "Wing V" (index 2) on desktop
    const dOptions = await dPage.$$('#BusinessSpacesOptions .biz-option-item');
    if (dOptions[2]) {
      await dOptions[2].click();
      await dPage.waitForTimeout(400);

      const dActiveText = await dPage.evaluate(() => {
        const active = document.querySelector('#BusinessSpacesOptions .biz-detail-panel.is-active');
        return active ? active.innerText : null;
      });
      console.log('Desktop active panel after clicking Wing V:', dActiveText);

      await dPage.screenshot({
        path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_biz_wingv_click_desktop.png'
      });
    }
  }

  await browser.close();
}

verifyAll();

