import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(2000);

  console.log('Current URL before click:', page.url());

  // Click .arbor-inquire-btn
  const btn = await page.locator('.arbor-inquire-btn');
  console.log('Button href:', await btn.getAttribute('href'));
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    btn.click(),
  ]);

  console.log('Current URL after click:', page.url());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/contact_page_loaded.png' });

  await browser.close();
}

main().catch(console.error);

