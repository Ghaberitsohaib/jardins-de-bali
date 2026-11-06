import { chromium } from 'playwright-core';

async function capture() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/typography_showcase.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Full showcase
  await page.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/typography_showcase_full.png',
    fullPage: true
  });

  // Capture individual cards
  const cards = await page.$$('.font-card');
  const names = [
    'typography_opt1_cinzel.png',
    'typography_opt2_italiana.png',
    'typography_opt3_bodoni.png',
    'typography_opt4_syncopate.png',
    'typography_opt5_marcellus.png'
  ];

  for (let i = 0; i < cards.length && i < names.length; i++) {
    await cards[i].screenshot({
      path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/${names[i]}`
    });
  }

  await browser.close();
  console.log('Typography showcase captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

