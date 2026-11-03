import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'load', timeout: 30000 });
  // Wait until loader is gone
  await page.waitForTimeout(4000);

  // Click the mobile menu button
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('button.menu');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked menu button:', clicked);
  await page.waitForTimeout(1000);

  const menuDetails = await page.evaluate(() => {
    const header = document.querySelector('div.fixed.top-6') || document.querySelector('[class*="bg-[#1F261E]"]');
    return header ? header.outerHTML : 'none';
  });

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_menu_opened.png' });
  console.log('--- OPEN MENU HTML (FIRST 2000 CHARS) ---');
  console.log(menuDetails.slice(0, 2000));

  await browser.close();
}

main().catch(console.error);
