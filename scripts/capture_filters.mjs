import { chromium } from 'playwright-core';

async function capture() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  
  // 1. Desktop Viewport (1440x1000)
  const contextDesk = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2
  });
  const pageDesk = await contextDesk.newPage();
  await pageDesk.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(800);

  // Scroll directly to #Picker section
  await pageDesk.evaluate(() => {
    const picker = document.getElementById('Picker');
    if (picker) {
      const top = picker.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - 80);
    }
  });
  await pageDesk.waitForTimeout(800);

  // Screenshot desktop filter area
  await pageDesk.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_filters_desktop.png',
    fullPage: false
  });

  // Also capture element screenshot of just the filter card
  const filterCard = await pageDesk.$('.desktop-luxury-filter-card');
  if (filterCard) {
    await filterCard.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_filter_card_only.png'
    });
  }

  // 2. Mobile Viewport (393x852 - iPhone 16)
  const contextMob = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });
  const pageMob = await contextMob.newPage();
  await pageMob.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(800);

  // Scroll to Picker on mobile
  await pageMob.evaluate(() => {
    const picker = document.getElementById('Picker');
    if (picker) {
      const top = picker.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top);
    }
  });
  await pageMob.waitForTimeout(800);

  // Capture mobile view with the floating filter button
  await pageMob.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_filters_mobile.png',
    fullPage: false
  });

  // Open the mobile filter drawer via JS
  await pageMob.evaluate(() => {
    const trigger = document.getElementById('mobileFilterTrigger');
    if (trigger) trigger.click();
  });
  await pageMob.waitForTimeout(600);

  await pageMob.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_filters_mobile_open.png',
    fullPage: false
  });

  await browser.close();
  console.log('All captures finished successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
