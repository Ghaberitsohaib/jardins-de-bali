import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  // Desktop
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const top = await page.evaluate(() => {
    const el = document.getElementById('BusinessSpaces');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  await page.evaluate(y => window.scrollTo(0, y), top);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/final_business_desktop.png' });

  // Mobile
  const mobile = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await mobile.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await mobile.waitForTimeout(3000);

  const mTop = await mobile.evaluate(() => {
    const el = document.getElementById('BusinessSpaces');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  await mobile.evaluate(y => window.scrollTo(0, y), mTop);
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/final_business_mobile.png' });

  await browser.close();
  console.log('Saved final screenshots!');
}

main().catch(console.error);

