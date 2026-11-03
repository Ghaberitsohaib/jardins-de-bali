import fs from 'fs';
import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('https://belgradearbor.rs/en/retail-spaces', { waitUntil: 'networkidle' });
  const btn = await page.locator('button:has-text("FILTERS")').first();
  await btn.click();
  await page.waitForTimeout(500);
  const modalHtml = await page.evaluate(() => {
    const m = document.querySelector('.z-9999');
    return m ? m.outerHTML : 'none';
  });
  fs.writeFileSync('belgrade_modal_full.html', modalHtml);
  console.log('Saved belgrade_modal_full.html, size:', modalHtml.length);
  await browser.close();
})();

