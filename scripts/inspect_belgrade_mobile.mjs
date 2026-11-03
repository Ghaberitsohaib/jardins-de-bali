import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 }
  });
  try {
    await page.goto('https://belgradearbor.rs/en/apartments', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_apartments_mobile_0.png' });
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_apartments_mobile_500.png' });
    console.log('Saved belgrade screenshots');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();

