import { chromium } from 'playwright-core';

async function testJitter() {
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

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  // Wait just 500ms (video is still playing, not finished)
  await page.waitForTimeout(500);

  // User starts scrolling!
  const positions = [];
  for (let i = 0; i < 20; i++) {
    const y = i * 20;
    await page.evaluate((scrollPos) => {
      window.scrollTo(0, scrollPos);
    }, y);
    await page.waitForTimeout(50);
    const pos = await page.evaluate(() => {
      const title = document.getElementById('arborGiantTitle');
      const stage = document.getElementById('arborStage');
      return {
        y: window.scrollY,
        titleTransform: title ? title.style.transform : null,
        titleOpacity: title ? title.style.opacity : null,
        titleFilter: title ? title.style.filter : null,
        stageTransform: stage ? stage.style.transform : null,
      };
    });
    positions.push(pos);
  }

  console.log('Scroll trace:', JSON.stringify(positions, null, 2));
  await browser.close();
}

testJitter().catch(err => {
  console.error(err);
  process.exit(1);
});

