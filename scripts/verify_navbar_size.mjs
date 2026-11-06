import { chromium } from 'playwright-core';

async function verify() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  // 1. Mobile 390x844
  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const pageMob = await mobCtx.newPage();
  await pageMob.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(1000);

  // Closed navbar on mobile
  const headerMob = await pageMob.$('.arbor-header');
  if (headerMob) {
    await headerMob.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_nav_mob_closed.png' });
    console.log('Saved verify_nav_mob_closed.png');
  }

  // Open the menu by clicking the menu button
  const menuBtn = await pageMob.$('#mobileMenuToggle');
  if (menuBtn) {
    await menuBtn.click();
    await pageMob.waitForTimeout(600); // Wait for open transition
    
    // Screenshot the top of the open menu
    await pageMob.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_nav_mob_open.png',
      clip: { x: 0, y: 0, width: 390, height: 450 }
    });
    console.log('Saved verify_nav_mob_open.png');
  }

  // 2. Desktop 1440x900
  const deskCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const pageDesk = await deskCtx.newPage();
  await pageDesk.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(1000);

  const menuBtnDesk = await pageDesk.$('#mobileMenuToggle');
  if (menuBtnDesk) {
    await menuBtnDesk.click();
    await pageDesk.waitForTimeout(600);
    await pageDesk.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_nav_desk_open.png',
      clip: { x: 150, y: 0, width: 1140, height: 400 }
    });
    console.log('Saved verify_nav_desk_open.png');
  }

  await browser.close();
}

verify();
