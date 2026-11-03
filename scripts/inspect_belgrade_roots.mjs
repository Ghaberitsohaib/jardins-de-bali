import { chromium } from 'playwright-core';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
  });

  console.log('Navigating to belgradearbor.rs/en...');
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Get full HTML of #Roots
  const rootsData = await page.evaluate(() => {
    const el = document.getElementById('Roots');
    if (!el) return null;
    return {
      outerHTML: el.outerHTML,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      computedStyle: {
        position: window.getComputedStyle(el).position,
        height: window.getComputedStyle(el).height,
        display: window.getComputedStyle(el).display,
      }
    };
  });

  if (rootsData) {
    fs.writeFileSync('scripts/belgrade_roots_outer.html', rootsData.outerHTML);
    console.log('Roots HTML saved to scripts/belgrade_roots_outer.html. Length:', rootsData.outerHTML.length);
  }

  // Scroll #Roots into view
  await page.evaluate(() => {
    document.getElementById('Roots')?.scrollIntoView();
  });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_roots_screen1.png' });

  // Scroll through Roots to observe steps
  for (let i = 1; i <= 4; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_roots_step_${i}.png` });
  }

  await browser.close();
  console.log('Done capturing live Belgrade Roots sequence!');
}

main().catch(console.error);
