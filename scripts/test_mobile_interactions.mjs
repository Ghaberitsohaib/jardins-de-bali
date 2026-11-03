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

  // Click the hamburger menu toggle
  await page.click('#mobileMenuToggle');
  await page.waitForTimeout(600);

  // Screenshot open menu
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_menu_open.png' });

  // Click WhatsApp or Inquire button
  await page.click('#closeContactModalBtn').catch(() => {});
  await page.click('#arborMenuBackdrop').catch(() => {});
  await page.waitForTimeout(400);

  // Test opening contact modal from bottom Inquire button
  await page.click('.mobile-sticky-cta-btn.inquire');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_inquire_modal.png' });

  await browser.close();
  console.log('Mobile menu & modal test complete.');
}

main().catch(console.error);

