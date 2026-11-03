import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/residences.html', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_screen3_residences.png' });

  await browser.close();
  console.log('Saved Screen 3 verify screenshot!');
}

main().catch(console.error);

