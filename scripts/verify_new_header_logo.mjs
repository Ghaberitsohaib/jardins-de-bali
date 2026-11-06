import { chromium } from 'playwright-core';

async function verify() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  // 1. Desktop 1440x900
  const deskCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const pageDesk = await deskCtx.newPage();
  await pageDesk.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(1000);

  // Screenshot header area on desktop
  const headerDesk = await pageDesk.$('.arbor-header');
  if (headerDesk) {
    await headerDesk.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_header_desktop.png' });
    console.log('Saved verify_header_desktop.png');
  }

  // 2. Mobile 390x844
  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const pageMob = await mobCtx.newPage();
  await pageMob.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(1000);

  // Screenshot header area on mobile
  const headerMob = await pageMob.$('.arbor-header');
  if (headerMob) {
    await headerMob.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_header_mobile.png' });
    console.log('Saved verify_header_mobile.png');
  }

  // Full mobile top fold
  await pageMob.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_mobile_hero_top.png',
    clip: { x: 0, y: 0, width: 390, height: 400 }
  });
  console.log('Saved verify_mobile_hero_top.png');

  await browser.close();
}

verify();

