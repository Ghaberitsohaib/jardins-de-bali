import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const mobile = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });

  // 1. Business mobile
  await mobile.goto('http://localhost:5173/business.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_verify_business.png' });

  // 2. Residences mobile
  await mobile.goto('http://localhost:5173/residences.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/mobile_verify_residences.png' });

  await browser.close();
  console.log('Mobile screenshots captured successfully!');
}

main().catch(console.error);

