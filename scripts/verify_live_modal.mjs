import { chromium } from 'playwright-core';

async function verifyModal() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://glowing-glyph-6st85rq.shipstatic.com/retail-spaces.html', { waitUntil: 'networkidle' });

  // Click card 1
  const card1 = await page.$('#retailGrid .residence-card');
  if (card1) {
    await card1.click();
    await page.waitForTimeout(600);
    const isActive = await page.$eval('#unitDetailBackdrop', el => el.classList.contains('is-active'));
    const title = await page.$eval('#unitDetailBackdrop .modal-lot-id', el => el.textContent.trim());
    console.log('Modal is-active:', isActive, 'Title:', title);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_modal_opened.png' });
    console.log('Saved live_modal_opened.png');
  }

  await browser.close();
}

verifyModal().catch(console.error);

