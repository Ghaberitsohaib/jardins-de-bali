import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });

  try {
    await page.goto('https://belgradearbor.rs/en', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_mobile_hero_0.png' });
    
    // Scroll down 300px
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_mobile_hero_scroll.png' });
    
    console.log('Screenshots saved!');
  } catch (err) {
    console.error('Failed to load belgradearbor.rs:', err);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

