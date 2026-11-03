import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  // 1. DESKTOP TEST
  const desktopPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1500);

  // Screenshot desktop top hero + navbar
  await desktopPage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_nav_fixed.png',
  });

  // Zoom into navbar pill specifically
  const header = await desktopPage.$('#overlayHeader');
  if (header) {
    await header.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_nav_pill_crop.png',
    });
  }

  // 2. MOBILE TEST
  const mobilePage = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1500);

  // Closed mobile view
  await mobilePage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_nav_closed.png',
  });

  // Open mobile menu
  await mobilePage.click('#mobileMenuToggle');
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_nav_opened.png',
  });

  await browser.close();
  console.log('Verification screenshots taken!');
}

main().catch(console.error);

