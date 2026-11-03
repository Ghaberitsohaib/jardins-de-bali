import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  // 1. Desktop Menu
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(2000);

  // Click menu toggle
  await page.click('#arborMenuToggle');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/nav_menu_desktop_no_location.png' });

  // 2. Mobile Menu
  const mobile = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await mobile.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await mobile.waitForTimeout(2000);

  await mobile.click('.arbor-menu-toggle');
  await mobile.waitForTimeout(1000);

  await mobile.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/nav_menu_mobile_no_location.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

main().catch(console.error);

