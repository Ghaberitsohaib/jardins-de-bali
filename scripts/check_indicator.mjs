import { chromium } from 'playwright-core';

async function checkIndicator() {
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

  // Scroll to #ResidenceOptions
  await page.evaluate(() => {
    const el = document.getElementById('ResidenceOptions');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(400);

  // Click Two Bedroom
  await page.evaluate(() => {
    const items = document.querySelectorAll('.res-option-item');
    if (items[2]) items[2].click();
  });
  await page.waitForTimeout(400);

  const barInfo = await page.evaluate(() => {
    const activeItem = document.querySelector('.res-option-item.is-active');
    const bar = activeItem?.querySelector('.bg-pine-green');
    if (!bar) return 'no bar found';
    const rect = bar.getBoundingClientRect();
    const computed = window.getComputedStyle(bar);
    return {
      display: computed.display,
      width: computed.width,
      height: computed.height,
      backgroundColor: computed.backgroundColor,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    };
  });

  console.log('Bar info:', JSON.stringify(barInfo, null, 2));

  // Screenshot section
  const section = await page.$('#ResidenceOptions');
  if (section) {
    await section.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/res_section_full.png' });
  }

  await browser.close();
}

checkIndicator();

