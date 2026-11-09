import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // Desktop 1440x900
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/index.html', { waitUntil: 'networkidle' });

  // Scroll to #Amenities
  await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'end' });
  });
  // Wait for 1.8s so the 3D staggered char animation completes
  await page.waitForTimeout(1800);

  const info = await page.evaluate(() => {
    const sec = document.getElementById('Amenities');
    const h2 = sec.querySelector('h2');
    const p = sec.querySelector('p.paragraph:not(.hidden)');
    const h2Rect = h2.getBoundingClientRect();
    const pRect = p.getBoundingClientRect();
    const h2Style = window.getComputedStyle(h2);
    const chars = h2.querySelectorAll('.char');
    const firstCharOpacity = chars.length ? window.getComputedStyle(chars[0]).opacity : 'N/A';
    return {
      fontSize: h2Style.fontSize,
      h2Width: h2Rect.width,
      h2Left: h2Rect.left,
      h2Right: h2Rect.right,
      pRight: pRect.right,
      gap: h2Rect.left - pRect.right,
      charCount: chars.length,
      firstCharOpacity
    };
  });

  console.log('Desktop 1440px info:', JSON.stringify(info, null, 2));

  const secHandle = await page.$('#Amenities');
  if (secHandle) {
    await secHandle.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/0af7e4c9-1bae-4e02-a9ae-bb70c83e4803/amenities_large_animated_desktop.png' });
  }

  // Mobile 390x844
  const mobPage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
  await mobPage.goto('http://localhost:5173/index.html', { waitUntil: 'networkidle' });
  await mobPage.evaluate(() => {
    const el = document.getElementById('Amenities');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await mobPage.waitForTimeout(1800);
  const mobSec = await mobPage.$('#Amenities');
  if (mobSec) {
    await mobSec.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/0af7e4c9-1bae-4e02-a9ae-bb70c83e4803/amenities_large_animated_mobile.png' });
  }

  await browser.close();
}

main().catch(console.error);
