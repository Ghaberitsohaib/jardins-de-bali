import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const desktopPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1000);

  // Click menu toggle on desktop
  await desktopPage.click('#mobileMenuToggle');
  await desktopPage.waitForTimeout(800);

  await desktopPage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_menu_open.png',
  });

  await browser.close();
  console.log('Desktop open menu screenshot captured.');
}

main().catch(console.error);

