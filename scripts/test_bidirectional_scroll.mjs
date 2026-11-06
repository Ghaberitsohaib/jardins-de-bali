import { chromium } from 'playwright-core';

async function testBidirectionalScroll() {
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
  await page.waitForTimeout(1000);

  // 1. Scroll down smoothly
  console.log('--- SCROLLING DOWN ---');
  for (let y = 0; y <= 400; y += 50) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(50);
    const state = await page.evaluate(() => {
      const title = document.getElementById('arborGiantTitle');
      return {
        scrollY: window.scrollY,
        opacity: title ? title.style.opacity : null,
        transform: title ? title.style.transform : null,
      };
    });
    console.log(`y=${state.scrollY}: opacity=${state.opacity}, transform=${state.transform}`);
  }

  // 2. Scroll back up smoothly
  console.log('--- SCROLLING BACK UP ---');
  for (let y = 400; y >= 0; y -= 50) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(50);
    const state = await page.evaluate(() => {
      const title = document.getElementById('arborGiantTitle');
      return {
        scrollY: window.scrollY,
        opacity: title ? title.style.opacity : null,
        transform: title ? title.style.transform : null,
      };
    });
    console.log(`y=${state.scrollY}: opacity=${state.opacity}, transform=${state.transform}`);
  }

  // Take screenshot at y=0 after scroll up
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_scroll_back_to_top.png' });
  console.log('Verification screenshot saved: verify_scroll_back_to_top.png');

  await browser.close();
}

testBidirectionalScroll().catch(err => {
  console.error(err);
  process.exit(1);
});

