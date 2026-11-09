import { chromium } from 'playwright-core';

async function verifyLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('requestfailed', req => {
    networkErrors.push({ url: req.url(), error: req.failure() });
  });

  page.on('response', resp => {
    if (resp.status() >= 400) networkErrors.push({ url: resp.url(), status: resp.status() });
  });

  console.log('Navigating to: https://neutral-hub-5xxjkp5.shipstatic.com/retail-spaces.html ...');
  await page.goto('https://neutral-hub-5xxjkp5.shipstatic.com/retail-spaces.html', { waitUntil: 'networkidle' });

  console.log('Console errors:', consoleErrors);
  console.log('Network errors:', networkErrors);

  // Check card count
  const cardCount = await page.$$eval('#retailGrid .retail-card-item', cards => cards.length);
  console.log('Cards rendered in grid:', cardCount);

  // Check card images
  const imgStats = await page.$$eval('#retailGrid .retail-card-item img', imgs =>
    imgs.map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }))
  );
  console.log('Card image stats (first 2):', imgStats.slice(0, 2));

  // Screenshot of top hero & header
  await page.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_verified_header_hero.png'
  });
  console.log('Saved live_verified_header_hero.png');

  // Screenshot of picker
  const picker = await page.$('#Picker');
  if (picker) {
    await picker.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_verified_picker.png'
    });
    console.log('Saved live_verified_picker.png');
  }

  // Click card 1
  const firstCard = await page.$('#retailGrid .retail-card-item');
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(600);
    const isModalActive = await page.$eval('#unitDetailBackdrop', el => el.classList.contains('is-active'));
    console.log('Is modal open:', isModalActive);

    await page.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_verified_modal.png'
    });
    console.log('Saved live_verified_modal.png');
  }

  await browser.close();
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});
