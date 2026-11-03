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
  await page.waitForTimeout(1000);

  // Trigger showFinalImage by scrolling slightly or invoking the logic
  await page.evaluate(() => {
    window.scrollBy(0, 50);
  });
  await page.waitForTimeout(1800);

  // Screenshot 1: Hero with restored BaytImmo Marrakech title
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/hero_baytimmo_restored.png' });

  // Open the mobile menu
  await page.click('#mobileMenuToggle');
  await page.waitForTimeout(800);

  // Screenshot 2: Open menu with Bayt Immo wordmark
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/menu_baytimmo_restored.png' });

  await browser.close();
  console.log('Screenshots captured successfully.');
}

main().catch(console.error);

