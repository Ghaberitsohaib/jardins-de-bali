import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(2000);

  // Click hamburger menu
  const menuToggle = await page.locator('.arbor-menu-toggle');
  await menuToggle.click();
  await page.waitForTimeout(1000);

  // Click the mobile inquire pill
  const mobilePill = await page.locator('.arbor-mobile-inquire-pill');
  console.log('Mobile pill href:', await mobilePill.getAttribute('href'));

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    mobilePill.click(),
  ]);

  console.log('Mobile URL after click:', page.url());
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_contact_loaded.png' });

  await browser.close();
}

main().catch(console.error);

