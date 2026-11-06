import { chromium } from 'playwright-core';

async function reproduce() {
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
  await page.waitForTimeout(600);

  // Click on "Two Bedroom" (data-index="2")
  await page.evaluate(() => {
    const items = document.querySelectorAll('.res-option-item');
    if (items[2]) items[2].click();
  });
  await page.waitForTimeout(600);

  // Screenshot the options list
  const listEl = await page.$('#resOptionsList');
  if (listEl) {
    await listEl.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/reproduce_res_list.png' });
    console.log('Saved reproduce_res_list.png');
  }

  await browser.close();
}

reproduce().catch(err => {
  console.error(err);
  process.exit(1);
});

