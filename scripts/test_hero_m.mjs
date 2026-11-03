import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.setContent(`
    <body style="margin:0;background:#000;height:100vh;">
      <video src="http://localhost:5173/home/hero-m.webm" autoplay muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>
    </body>
  `);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_hero_m.png' });
  await browser.close();
  console.log('done hero_m test');
}

main().catch(console.error);

