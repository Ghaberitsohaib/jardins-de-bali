import { chromium } from 'playwright-core';

async function verify() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  
  // Determine port
  let targetUrl = 'http://localhost:5174/retail-spaces.html';
  try {
    const testPage = await browser.newPage();
    const res = await testPage.goto('http://localhost:5174/retail-spaces.html', { timeout: 3000 });
    if (!res || res.status() !== 200) targetUrl = 'http://localhost:5173/retail-spaces.html';
    await testPage.close();
  } catch (e) {
    targetUrl = 'http://localhost:5173/retail-spaces.html';
  }
  console.log(`Using target URL: ${targetUrl}`);

  // Test 1: Desktop Viewport
  console.log('\n--- Testing Desktop (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  
  const consoleErrors = [];
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await desktopPage.goto(targetUrl, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  // Check desktop sidebar
  const hasDesktopSidebar = (await desktopPage.$('.picker-sidebar')) !== null;
  const hasOldBoxedDesktop = (await desktopPage.$('.desktop-luxury-filter-card')) !== null;
  console.log(`Desktop has .picker-sidebar: ${hasDesktopSidebar}`);
  console.log(`Desktop has old boxed card: ${hasOldBoxedDesktop}`);

  // Count pills
  const typePills = await desktopPage.$$('.picker-sidebar [data-filter-type]');
  console.log(`Desktop type pills count: ${typePills.length}`);
  
  // Test clicking "Offices"
  const officesBtn = await desktopPage.$('.picker-sidebar [data-filter-type="Offices"]');
  if (officesBtn) {
    await officesBtn.click();
    await desktopPage.waitForTimeout(400);
    const counterText = await desktopPage.$eval('#resultsCounter', el => el.textContent.trim());
    console.log(`After clicking Offices: resultsCounter = "${counterText}"`);
  }

  // Reset
  const resetBtn = await desktopPage.$('#resetFiltersBtn');
  if (resetBtn) {
    await resetBtn.click();
    await desktopPage.waitForTimeout(400);
    const counterText = await desktopPage.$eval('#resultsCounter', el => el.textContent.trim());
    console.log(`After reset: resultsCounter = "${counterText}"`);
  }

  // Scroll down to check loadMoreBtn and footer separation
  await desktopPage.evaluate(() => {
    document.getElementById('Picker').scrollIntoView();
  });
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: 'scripts/desktop_clean_sidebar.png', fullPage: false });
  console.log('Saved scripts/desktop_clean_sidebar.png');
  await desktopContext.close();

  // Test 2: Mobile Viewport (iPhone 14 / modern standard 393x852)
  console.log('\n--- Testing Mobile (393x852) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(`[Mobile] ${msg.text()}`);
  });

  await mobilePage.goto(targetUrl, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Scroll to Picker to ensure mobileFilterBar is visible
  await mobilePage.evaluate(() => {
    document.getElementById('Picker').scrollIntoView();
  });
  await mobilePage.waitForTimeout(600);

  // Click floating filter button or trigger drawer open
  const triggerBtn = await mobilePage.$('#mobileFilterTrigger');
  if (triggerBtn) {
    await triggerBtn.click();
    await mobilePage.waitForTimeout(600);
  } else {
    await mobilePage.evaluate(() => {
      document.getElementById('mobileFilterDrawer').classList.add('is-active');
    });
    await mobilePage.waitForTimeout(600);
  }

  // Verify mobile filter content elements
  const hasCardBoxMobile = (await mobilePage.$('#mobileFilterContent .filter-card-box')) !== null;
  const hasTypePillMobile = (await mobilePage.$('#mobileFilterContent .filter-type-pill')) !== null;
  const hasFilterPillsMobile = (await mobilePage.$('#mobileFilterContent .filter-pill')) !== null;
  const mobilePillsCount = (await mobilePage.$$('#mobileFilterContent .filter-pill')).length;
  
  console.log(`Mobile drawer has old .filter-card-box: ${hasCardBoxMobile}`);
  console.log(`Mobile drawer has old .filter-type-pill: ${hasTypePillMobile}`);
  console.log(`Mobile drawer has clean .filter-pill: ${hasFilterPillsMobile} (total: ${mobilePillsCount})`);

  // Capture screenshot of open mobile drawer
  await mobilePage.screenshot({ path: 'scripts/mobile_clean_drawer.png', fullPage: false });
  console.log('Saved scripts/mobile_clean_drawer.png');

  // Test interaction in mobile drawer: click "Retail / Magasins"
  const retailPill = await mobilePage.$('#mobileFilterContent [data-filter-type="Retail"]');
  if (retailPill) {
    await retailPill.click();
    await mobilePage.waitForTimeout(400);
    const drawerCounter = await mobilePage.$eval('#resultsCounterDrawer', el => el.textContent.trim());
    const applyBtnText = await mobilePage.$eval('#applyMobileFilterBtn', el => el.textContent.trim());
    console.log(`After clicking Retail on mobile: drawerCounter = "${drawerCounter}", applyBtnText = "${applyBtnText}"`);
  }

  // Click apply button
  const applyBtn = await mobilePage.$('#applyMobileFilterBtn');
  if (applyBtn) {
    await applyBtn.click();
    await mobilePage.waitForTimeout(600);
    const isDrawerOpen = await mobilePage.$eval('#mobileFilterDrawer', el => el.classList.contains('is-active'));
    console.log(`After clicking Apply: isDrawerOpen = ${isDrawerOpen}`);
  }

  // Check horizontal overflow
  const horizontalOverflow = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow: ${horizontalOverflow}`);
  console.log(`Total console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  }

  await mobileContext.close();
  await browser.close();
}

verify().catch(console.error);
