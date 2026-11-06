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
  await page.goto('http://localhost:5173/typography_script_showcase.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Full showcase
  await page.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/typography_coca_showcase_full.png',
    fullPage: true
  });

  // Capture individual cards
  const cards = await page.$$('.font-card');
  const names = [
    'script_opt1_coca_swoosh.png',
    'script_opt2_oleo.png',
    'script_opt3_pinyon_cartier.png',
    'script_opt4_lobster.png',
    'script_opt5_haviland.png',
    'script_opt6_stylescript.png'
  ];

  for (let i = 0; i < cards.length && i < names.length; i++) {
    await cards[i].screenshot({
      path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/${names[i]}`
    });
  }

  await browser.close();
  console.log('Script typography showcase captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

