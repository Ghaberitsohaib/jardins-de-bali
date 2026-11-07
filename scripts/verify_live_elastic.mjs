import { chromium } from 'playwright-core';

async function verifyLiveElastic() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

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

  console.log('Navigating to live URL: https://elastic-star-69swgfv.shipstatic.com/retail-spaces.html ...');
  await page.goto('https://elastic-star-69swgfv.shipstatic.com/retail-spaces.html', { waitUntil: 'networkidle' });

  console.log('Console errors:', consoleErrors);
  console.log('Network errors:', networkErrors);

  // Check card count
  const cardCount = await page.$$eval('#retailGrid .retail-card-item', cards => cards.length);
  console.log('Cards rendered in grid:', cardCount);

  // Check images
  const imgStats = await page.$$eval('#retailGrid .retail-card-item img', imgs =>
    imgs.map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }))
  );
  console.log('Card image stats:', imgStats);

  // Capture screenshot of #Picker
  const picker = await page.$('#Picker');
  if (picker) {
    await picker.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_verified_retail_plans_elastic.png'
    });
    console.log('Saved live_verified_retail_plans_elastic.png');
  }

  // Click card 1
  const firstCard = await page.$('#retailGrid .retail-card-item');
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(600);
    const isModalActive = await page.$eval('#unitDetailBackdrop', el => el.classList.contains('is-active'));
    console.log('Is modal open:', isModalActive);

    await page.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_modal_elastic.png'
    });
    console.log('Saved live_modal_elastic.png');

    // Close modal
    const closeBtn = await page.$('#closeUnitModalBtn');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // Check footer
  const footer = await page.$('#footer');
  if (footer) {
    await footer.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_footer_elastic.png'
    });
    console.log('Saved live_footer_elastic.png');
  }

  // Mobile viewport test (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);

  const mobilePicker = await page.$('#Picker');
  if (mobilePicker) {
    await mobilePicker.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_mobile_elastic.png'
    });
    console.log('Saved live_mobile_elastic.png');
  }

  await browser.close();
}

verifyLiveElastic().catch(err => {
  console.error(err);
  process.exit(1);
});
