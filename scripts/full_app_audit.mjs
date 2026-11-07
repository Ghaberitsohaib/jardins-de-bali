import { chromium, devices } from 'playwright-core';

const pagesToTest = [
  '/',
  '/index.html',
  '/residences.html',
  '/retail-spaces.html',
  '/business.html',
  '/about-the-investor.html',
  '/contact.html',
  '/maquette3d.html'
];

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const auditResults = [];

  for (const p of pagesToTest) {
    const pageErrors = [];
    const failedRequests = [];

    // Mobile Test
    const mobileContext = await browser.newContext({
      ...devices['iPhone 14 Pro'],
      deviceScaleFactor: 2
    });
    const mobilePage = await mobileContext.newPage();

    mobilePage.on('console', msg => {
      if (msg.type() === 'error') pageErrors.push(`[Console Error] ${msg.text()}`);
    });
    mobilePage.on('requestfailed', req => {
      // Ignore analytics / optional external fonts if blocked
      failedRequests.push(`[Request Failed] ${req.url()} (${req.failure()?.errorText})`);
    });

    try {
      const resp = await mobilePage.goto(`http://localhost:5173${p}`, { waitUntil: 'networkidle', timeout: 15000 });
      const status = resp?.status() || 0;

      // Check broken images
      const brokenImages = await mobilePage.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
      });

      // Desktop Test
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const desktopPage = await desktopContext.newPage();
      const deskResp = await desktopPage.goto(`http://localhost:5173${p}`, { waitUntil: 'networkidle', timeout: 15000 });

      auditResults.push({
        path: p,
        status,
        mobileOk: status === 200,
        desktopOk: deskResp?.status() === 200,
        errors: pageErrors,
        failedRequests,
        brokenImagesCount: brokenImages.length,
        brokenImages
      });

      await mobileContext.close();
      await desktopContext.close();
    } catch (err) {
      auditResults.push({
        path: p,
        error: err.message
      });
      await mobileContext.close();
    }
  }

  await browser.close();
  console.log('AUDIT COMPLETE:');
  console.log(JSON.stringify(auditResults, null, 2));
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});

