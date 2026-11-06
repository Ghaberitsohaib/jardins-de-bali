import { chromium, devices } from 'playwright-core';

async function testInteractivity() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Scroll to bizOptionsList
  const list = page.locator('#bizOptionsList');
  await list.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_revealed_options_details.png' });

  // Click on 'Retail'
  const retailBtn = page.locator('.biz-option-item').filter({ hasText: 'Retail' });
  await retailBtn.click();
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_revealed_retail_clicked.png' });

  await browser.close();
  console.log('Interactivity test finished.');
}

testInteractivity().catch(err => {
  console.error(err);
  process.exit(1);
});
