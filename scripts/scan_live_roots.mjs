import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
  });

  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Get the top of RootsMobile
  const rootsTop = await page.evaluate(() => {
    const el = document.getElementById('RootsMobile');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  console.log('RootsMobile page top:', rootsTop);

  // Scroll through range around rootsTop
  for (let offset = 200; offset <= 1600; offset += 200) {
    await page.evaluate((y) => window.scrollTo(0, y), rootsTop + offset);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/live_offset_${offset}.png` });
  }

  await browser.close();
  console.log('Done scanning offsets!');
}

main().catch(console.error);

