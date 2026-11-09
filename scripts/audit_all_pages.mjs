import { chromium } from 'playwright-core';

const BASE_URL = 'https://neutral-hub-5xxjkp5.shipstatic.com';

const PAGES = [
  '/',
  '/index.html',
  '/residences.html',
  '/retail-spaces.html',
  '/business.html',
  '/ventes.html',
  '/about-the-investor.html',
  '/contact.html',
  '/maquette3d.html'
];

async function audit() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = {};

  for (const path of PAGES) {
    const url = `${BASE_URL}${path}`;
    console.log(`\n========================================`);
    console.log(`Auditing: ${url}`);
    console.log(`========================================`);

    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const httpErrors = [];

    const onConsole = msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const onPageError = err => {
      pageErrors.push(err.message || String(err));
    };
    const onRequestFailed = req => {
      failedRequests.push({ url: req.url(), error: req.failure() });
    };
    const onResponse = resp => {
      if (resp.status() >= 400) {
        httpErrors.push({ url: resp.url(), status: resp.status() });
      }
    };

    page.on('console', onConsole);
    page.on('pageerror', onPageError);
    page.on('requestfailed', onRequestFailed);
    page.on('response', onResponse);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);

      // Check broken images
      const brokenImages = await page.$$eval('img', imgs => {
        return imgs
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => ({ src: img.src, alt: img.alt }));
      });

      // Check page title
      const title = await page.title();

      results[path] = {
        title,
        status: 'SUCCESS',
        consoleErrors,
        pageErrors,
        failedRequests,
        httpErrors,
        brokenImages
      };

      console.log(`✓ Page Loaded: "${title}"`);
      console.log(`- Console errors: ${consoleErrors.length}`);
      console.log(`- Page errors: ${pageErrors.length}`);
      console.log(`- Network 4xx/5xx: ${httpErrors.length}`);
      console.log(`- Broken images: ${brokenImages.length}`);

      if (consoleErrors.length > 0) console.error('Console errors:', consoleErrors);
      if (pageErrors.length > 0) console.error('Page errors:', pageErrors);
      if (httpErrors.length > 0) console.error('HTTP errors:', httpErrors);
      if (brokenImages.length > 0) console.error('Broken images:', brokenImages);

    } catch (err) {
      results[path] = {
        status: 'FAILED',
        error: err.message
      };
      console.error(`✗ Failed to load ${url}:`, err.message);
    } finally {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
      page.off('response', onResponse);
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log('AUDIT SUMMARY');
  console.log('========================================');
  console.log(JSON.stringify(results, null, 2));
}

audit().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
