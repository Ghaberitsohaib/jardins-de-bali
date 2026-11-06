import { chromium } from 'playwright-core';

async function diagnose() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const page = await mobCtx.newPage();

  const logs = [];
  page.on('console', msg => logs.push(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Measure scroll positions and check for jumps
  const scrollData = [];
  for (let s = 0; s <= 600; s += 50) {
    await page.evaluate((y) => window.scrollTo(0, y), s);
    await page.waitForTimeout(100);
    const state = await page.evaluate(() => {
      const title = document.getElementById('arborGiantTitle');
      const stage = document.getElementById('arborStage');
      const video = document.getElementById('arborHeroVideo');
      const img = document.getElementById('arborHeroFinalImg');
      return {
        scrollY: window.scrollY,
        titleStyle: title ? {
          opacity: window.getComputedStyle(title).opacity,
          transform: window.getComputedStyle(title).transform,
          filter: window.getComputedStyle(title).filter,
        } : null,
        stageTransform: stage ? window.getComputedStyle(stage).transform : null,
        videoOpacity: video ? window.getComputedStyle(video).opacity : null,
        imgOpacity: img ? window.getComputedStyle(img).opacity : null,
      };
    });
    scrollData.push(state);
  }

  // Also capture screenshot at y=100 and y=300
  await page.evaluate(() => window.scrollTo(0, 150));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/diagnose_scroll_150.png' });

  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/diagnose_scroll_300.png' });

  console.log('Scroll data:', JSON.stringify(scrollData, null, 2));
  console.log('Logs:', logs);

  await browser.close();
}

diagnose().catch(err => {
  console.error(err);
  process.exit(1);
});

