import { chromium } from 'playwright-core';

async function verifyAmenities() {
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

  await page.evaluate(() => {
    const el = document.getElementById('AmenitiesOptions');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);

  // Click Garage (data-index="2")
  await page.evaluate(() => {
    const items = document.querySelectorAll('.amen-option-item');
    if (items[2]) items[2].click();
  });
  await page.waitForTimeout(600);

  const amenList = await page.$('#amenOptionsList');
  if (amenList) {
    await amenList.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/amen_opt_garage.png' });
    console.log('Saved amen_opt_garage.png');
  }

  await browser.close();
}

verifyAmenities();

