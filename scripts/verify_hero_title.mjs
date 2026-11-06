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

  // Force reveal of hero title if not yet revealed
  await pageDesk.evaluate(() => {
    const titleOverlay = document.getElementById('arborGiantTitle');
    const heroFinalImg = document.getElementById('arborHeroFinalImg');
    const heroVideo = document.getElementById('arborHeroVideo');
    if (heroVideo) heroVideo.style.display = 'none';
    if (heroFinalImg) {
      heroFinalImg.style.opacity = '1';
      heroFinalImg.style.display = 'block';
    }
    if (titleOverlay) {
      titleOverlay.classList.add('is-visible');
      titleOverlay.style.opacity = '1';
      titleOverlay.style.filter = 'none';
      titleOverlay.style.transform = 'none';
      titleOverlay.style.visibility = 'visible';
    }
  });
  await pageDesk.waitForTimeout(600);

  await pageDesk.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_hero_desktop_title.png',
    fullPage: false
  });

  // Capture close-up of the title element
  const titleEl = await pageDesk.$('#arborHeroHeading');
  if (titleEl) {
    await titleEl.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_title_element_desktop.png'
    });
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

  await pageMob.evaluate(() => {
    const titleOverlay = document.getElementById('arborGiantTitle');
    const heroFinalImg = document.getElementById('arborHeroFinalImg');
    const heroVideo = document.getElementById('arborHeroVideo');
    if (heroVideo) heroVideo.style.display = 'none';
    if (heroFinalImg) {
      heroFinalImg.style.opacity = '1';
      heroFinalImg.style.display = 'block';
    }
    if (titleOverlay) {
      titleOverlay.classList.add('is-visible');
      titleOverlay.style.opacity = '1';
      titleOverlay.style.filter = 'none';
      titleOverlay.style.transform = 'none';
      titleOverlay.style.visibility = 'visible';
    }
  });
  await pageMob.waitForTimeout(600);

  await pageMob.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_hero_mobile_title.png',
    fullPage: false
  });

  await browser.close();
  console.log('Verification captures completed successfully!');
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});

