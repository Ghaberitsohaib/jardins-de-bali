import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Scroll to #Installment
  const instTop = await page.evaluate(() => {
    const el = document.getElementById('Installment');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  console.log('Installment top on belgrade:', instTop);

  // Take screenshot at instTop - 300, instTop, instTop + 300
  await page.evaluate(y => window.scrollTo(0, y), instTop - 300);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_inst_scroll_1.png' });

  await page.evaluate(y => window.scrollTo(0, y), instTop);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_inst_scroll_2.png' });

  await page.evaluate(y => window.scrollTo(0, y), instTop + 400);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_inst_scroll_3.png' });

  await browser.close();
}

main().catch(console.error);

