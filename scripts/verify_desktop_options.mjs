import { chromium } from 'playwright-core';

async function verifyDesktop() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const deskCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await deskCtx.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    const el = document.getElementById('ResidenceOptions');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(500);

  // Click Two Bedroom
  await page.evaluate(() => {
    const items = document.querySelectorAll('.res-option-item');
    if (items[2]) items[2].click();
  });
  await page.waitForTimeout(500);

  const list = await page.$('#resOptionsList');
  if (list) {
    await list.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/res_desk_two_bedroom.png' });
    console.log('Saved res_desk_two_bedroom.png');
  }

  await browser.close();
}

verifyDesktop();

