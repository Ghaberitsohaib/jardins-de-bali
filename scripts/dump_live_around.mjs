import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const html = await page.evaluate(() => {
    const el = document.getElementById('Around');
    return el ? el.outerHTML : 'Not found';
  });
  console.log('Around length:', html.length);
  console.log('Around preview:', html.substring(0, 1500));

  await browser.close();
}

main().catch(console.error);

