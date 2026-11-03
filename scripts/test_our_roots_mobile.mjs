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

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Get position of #RootsMobile
  const rootsTop = await page.evaluate(() => {
    const el = document.getElementById('RootsMobile');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  console.log('RootsMobile top:', rootsTop);

  // 1. Scroll right to the start of RootsMobile (Screen 1)
  await page.evaluate((top) => window.scrollTo(0, top + 150), rootsTop);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/our_roots_mobile_screen1.png' });

  // 2. Scroll slightly further in Screen 1
  await page.evaluate((top) => window.scrollTo(0, top + 600), rootsTop);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/our_roots_mobile_screen1_mid.png' });

  // 3. Scroll to Screen 2
  await page.evaluate((top) => window.scrollTo(0, top + 2200), rootsTop);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/our_roots_mobile_screen2.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

main().catch(console.error);

