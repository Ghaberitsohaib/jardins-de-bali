import { chromium } from 'playwright-core';

async function testFullInteraction() {
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

  console.log('Navigating to glowing-glyph live URL...');
  await page.goto('https://glowing-glyph-6st85rq.shipstatic.com/retail-spaces.html', { waitUntil: 'networkidle' });

  console.log('Page loaded. Console errors:', consoleErrors);
  console.log('Network errors:', networkErrors);

  // Check card count
  const cardCount = await page.$$eval('#retailGrid .residence-card', cards => cards.length);
  console.log('Cards rendered in grid:', cardCount);

  // Take full page screenshot
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/glowing_glyph_fullpage.png', fullPage: true });
  console.log('Saved glowing_glyph_fullpage.png');

  // Test Filter button click
  const retailBtn = await page.$('button[data-filter-type="Retail"]');
  if (retailBtn) {
    await retailBtn.click();
    await page.waitForTimeout(400);
    const filteredCount = await page.$$eval('#retailGrid .residence-card', cards => cards.length);
    console.log('Cards after Retail filter click:', filteredCount);
  }

  // Test Reset button click
  const resetBtn = await page.$('#resetFiltersBtn');
  if (resetBtn) {
    await resetBtn.click();
    await page.waitForTimeout(400);
    const resetCount = await page.$$eval('#retailGrid .residence-card', cards => cards.length);
    console.log('Cards after Reset click:', resetCount);
  }

  // Test Load More button
  const loadMore = await page.$('#loadMoreBtn');
  if (loadMore) {
    await loadMore.click();
    await page.waitForTimeout(400);
    const afterLoadMoreCount = await page.$$eval('#retailGrid .residence-card', cards => cards.length);
    console.log('Cards after Load More click:', afterLoadMoreCount);
  }

  // Test Modal opening on Card 1
  const card1 = await page.$('#retailGrid .residence-card');
  if (card1) {
    await card1.click();
    await page.waitForTimeout(600);
    const modalVisible = await page.$eval('#unitModal', el => window.getComputedStyle(el).display !== 'none' && !el.classList.contains('hidden'));
    console.log('Modal visible after clicking card 1:', modalVisible);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/glowing_glyph_modal.png' });
  }

  await browser.close();
}

testFullInteraction().catch(console.error);

