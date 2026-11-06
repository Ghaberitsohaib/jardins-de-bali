import { chromium } from 'playwright-core';

async function generatePngIcons() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 512, height: 512 },
    deviceScaleFactor: 1
  });

  // Load the SVG directly into the page
  await page.goto('http://localhost:5173/icons/tree-symbol.svg');
  await page.waitForTimeout(300);

  // Take screenshot at 512x512
  await page.screenshot({
    path: 'C:/Users/ghabr/Desktop/immo/public/apple-touch-icon.png',
    clip: { x: 0, y: 0, width: 512, height: 512 },
    omitBackground: true
  });

  // Also 64x64 for favicon.png
  const page64 = await browser.newPage({
    viewport: { width: 64, height: 64 },
    deviceScaleFactor: 1
  });
  await page64.goto('http://localhost:5173/icons/tree-symbol.svg');
  await page64.waitForTimeout(300);

  await page64.screenshot({
    path: 'C:/Users/ghabr/Desktop/immo/public/favicon.png',
    clip: { x: 0, y: 0, width: 64, height: 64 },
    omitBackground: true
  });

  console.log('Generated apple-touch-icon.png and favicon.png');
  await browser.close();
}

generatePngIcons();

