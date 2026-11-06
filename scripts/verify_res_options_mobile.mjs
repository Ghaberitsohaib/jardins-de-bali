import { chromium } from 'playwright-core';

async function verify() {
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
  await page.waitForTimeout(1000);

  // Scroll to #ResidenceOptions
  await page.evaluate(() => {
    const el = document.getElementById('ResidenceOptions');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(500);

  // 1. Initial screenshot (Studio selected)
  const listEl = await page.$('#resOptionsList');
  if (listEl) {
    await listEl.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/res_opt_initial_studio.png' });
    console.log('Saved res_opt_initial_studio.png');
  }

  // 2. Click "Two Bedroom" (index 2)
  await page.evaluate(() => {
    const items = document.querySelectorAll('.res-option-item');
    if (items[2]) items[2].click();
  });
  await page.waitForTimeout(600);

  if (listEl) {
    await listEl.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/res_opt_two_bedroom.png' });
    console.log('Saved res_opt_two_bedroom.png');
  }

  // 3. Click "One Bedroom" (index 1)
  await page.evaluate(() => {
    const items = document.querySelectorAll('.res-option-item');
    if (items[1]) items[1].click();
  });
  await page.waitForTimeout(600);

  if (listEl) {
    await listEl.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/res_opt_one_bedroom.png' });
    console.log('Saved res_opt_one_bedroom.png');
  }

  // 4. Also test Amenities Options list
  await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    const items = document.querySelectorAll('.amen-option-item');
    if (items[2]) items[2].click(); // Garage
  });
  await page.waitForTimeout(600);

  const amenList = await page.$('#amenOptionsList');
  if (amenList) {
    await amenList.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/amen_opt_garage.png' });
    console.log('Saved amen_opt_garage.png');
  }

  await browser.close();
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});

