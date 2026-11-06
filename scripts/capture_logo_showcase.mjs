import { chromium } from 'playwright-core';

async function captureShowcase() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1200, height: 1100 },
    deviceScaleFactor: 2
  });

  await page.goto('http://localhost:5173/logo_showcase.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/logo_showcase_preview.png',
    fullPage: true
  });

  console.log('Saved logo_showcase_preview.png');
  await browser.close();
}

captureShowcase();

