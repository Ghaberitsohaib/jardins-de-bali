import { chromium, devices } from 'playwright-core';

async function testAmenities() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // 1. MOBILE TEST (iPhone 14 Pro)
  const iPhone = devices['iPhone 14 Pro'];
  const mobileCtx = await browser.newContext({
    ...iPhone,
    deviceScaleFactor: 2
  });
  const mPage = await mobileCtx.newPage();
  await mPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(1000);

  const amenEl = await mPage.$('#Amenities');
  if (amenEl) {
    await amenEl.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(500);
    await mPage.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_amen_hero_mobile.png' });
  }

  const optEl = await mPage.$('#AmenitiesOptions');
  if (optEl) {
    await optEl.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(500);

    const items = await mPage.$$eval('#AmenitiesOptions .amen-option-item', els => els.map(e => e.innerText.trim()));
    console.log('Mobile Amenity Options:', items);

    // Take screenshot of options list
    await mPage.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_amen_options_mobile.png' });

    // Click Private fitness space (index 1)
    const optionBtns = await mPage.$$('#AmenitiesOptions .amen-option-item');
    if (optionBtns[1]) {
      await optionBtns[1].click();
      await mPage.waitForTimeout(400);
      await mPage.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_amen_fitness_click_mobile.png' });
    }

    // Click Garage (index 2)
    if (optionBtns[2]) {
      await optionBtns[2].click();
      await mPage.waitForTimeout(400);
      await mPage.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_amen_garage_click_mobile.png' });
    }
  }

  // 2. DESKTOP TEST
  const deskCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5
  });
  const dPage = await deskCtx.newPage();
  await dPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(1000);

  const dOptEl = await dPage.$('#AmenitiesOptions');
  if (dOptEl) {
    await dOptEl.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(500);
    await dPage.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_amen_desktop.png' });
  }

  await browser.close();
}

testAmenities();
