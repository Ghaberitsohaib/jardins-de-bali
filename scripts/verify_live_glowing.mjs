import { chromium } from 'playwright-core';

async function verifyLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  
  const failedRequests = [];
  page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure() }));
  page.on('response', resp => {
    if (resp.status() >= 400) failedRequests.push({ url: resp.url(), status: resp.status() });
  });

  await page.goto('https://glowing-glyph-6st85rq.shipstatic.com/retail-spaces.html', { waitUntil: 'networkidle' });

  // Scroll to results header bar
  await page.evaluate(() => {
    const el = document.querySelector('.results-header-bar');
    if (el) {
      el.scrollIntoView({ block: 'start', inline: 'nearest' });
      window.scrollBy(0, -30);
    }
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_glowing_glyph_retail.png' });
  console.log('Saved live_glowing_glyph_retail.png');
  console.log('Failed requests on live:', failedRequests.length);

  await browser.close();
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});
