import { chromium } from 'playwright-core';

async function testLiveDeployment() {
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

  console.log('Navigating to live deployment...');
  await page.goto('https://hyped-loop-pr8b68v.shipstatic.com/retail-spaces.html', { waitUntil: 'networkidle' });

  // 1. Check footer color
  const footerTitleColor = await page.$eval('#footer .heading-2', el => window.getComputedStyle(el).color);
  const footerTitleText = await page.$eval('#footer .heading-2', el => el.textContent.trim());
  console.log('Live footer title:', footerTitleText, 'Color:', footerTitleColor);

  // 2. Scroll to footer and take screenshot
  await page.evaluate(() => {
    const heading = document.querySelector('#footer .heading-2');
    if (heading) {
      heading.scrollIntoView({ block: 'start', inline: 'nearest' });
      window.scrollBy(0, -60);
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_verified_footer.png' });
  console.log('Saved live_verified_footer.png');

  // 3. Scroll to Picker and check images
  const picker = await page.$('#Picker');
  if (picker) await picker.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const imgStats = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('#retailGrid img'));
    return imgs.map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete
    }));
  });

  console.log('Live cards image count:', imgStats.length);
  imgStats.slice(0, 4).forEach((s, i) => console.log(`Card ${i + 1}: ${s.src} (w:${s.naturalWidth}, h:${s.naturalHeight}, complete:${s.complete})`));
  console.log('Failed requests on live:', failedRequests.length);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_verified_retail_plans.png' });
  console.log('Saved live_verified_retail_plans.png');

  await browser.close();
}

testLiveDeployment().catch(err => {
  console.error(err);
  process.exit(1);
});

