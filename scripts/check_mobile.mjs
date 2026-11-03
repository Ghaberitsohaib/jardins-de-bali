import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Take screenshot 1: Hero with bottom sticky CTA bar and building render
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_view_1.png' });

  // Scroll slightly or trigger reveal
  await page.evaluate(() => {
    window.scrollBy(0, 50);
  });
  await page.waitForTimeout(1000);

  // Take screenshot 2: With BELGRADE ARBOR title overlay & Awwwards badge
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_view_2.png' });

  await browser.close();
  console.log('Mobile screenshots captured successfully.');
}

main().catch(console.error);
