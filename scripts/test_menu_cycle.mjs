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

  // Open menu
  await page.click('#mobileMenuToggle');
  await page.waitForTimeout(500);

  // Close menu by clicking toggle again
  await page.click('#mobileMenuToggle');
  await page.waitForTimeout(500);

  // Capture screenshot after close to verify clean return
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/menu_closed_return.png' });

  await browser.close();
  console.log('Tested open and close cycle successfully.');
}

main().catch(console.error);

