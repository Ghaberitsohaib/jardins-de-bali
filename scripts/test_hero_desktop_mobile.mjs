import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  
  // 1. Desktop Test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(2000);

  const desktopInfo = await page.evaluate(async () => {
    const v = document.getElementById('arborHeroVideo');
    return {
      src: v ? v.currentSrc || v.src : null,
      videoWidth: v ? v.videoWidth : null,
      videoHeight: v ? v.videoHeight : null,
      paused: v ? v.paused : null
    };
  });
  console.log('Desktop video info:', desktopInfo);

  // Take screenshots at 2s (sketch) and 8s (render)
  for (const t of [2, 7]) {
    await page.evaluate((time) => {
      const v = document.getElementById('arborHeroVideo');
      if (v) v.currentTime = time;
    }, t);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_hero_${t}s.png` });
  }

  // 2. Mobile Test
  const mobilePage = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await mobilePage.waitForTimeout(2000);

  const mobileInfo = await mobilePage.evaluate(async () => {
    const v = document.getElementById('arborHeroVideo');
    return {
      src: v ? v.currentSrc || v.src : null,
      videoWidth: v ? v.videoWidth : null,
      videoHeight: v ? v.videoHeight : null,
    };
  });
  console.log('Mobile video info:', mobileInfo);

  await browser.close();
}

main().catch(console.error);

