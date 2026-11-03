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
  await page.waitForTimeout(1500);

  // Click the hamburger button
  await page.click('#mobileMenuToggle');
  await page.waitForTimeout(800);

  // Capture screenshot of the full open mobile menu
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/new_open_menu_mobile.png' });

  await browser.close();
  console.log('Captured new_open_menu_mobile.png successfully.');
}

main().catch(console.error);

