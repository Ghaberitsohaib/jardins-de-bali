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

  console.log('Opening belgradearbor.rs/en...');
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Scroll to RootsMobile
  const info = await page.evaluate(() => {
    const rm = document.getElementById('RootsMobile');
    if (!rm) return 'No RootsMobile';

    // Find any ScrollTriggers associated with #RootsMobile or .roots-scroller
    const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
      trigger: st.trigger?.id || st.trigger?.className,
      start: st.start,
      end: st.end,
      pin: !!st.pin,
      vars: {
        start: st.vars?.start,
        end: st.vars?.end,
        scrub: st.vars?.scrub,
        snap: st.vars?.snap,
        pin: !!st.vars?.pin
      }
    })) : 'No ScrollTrigger global';

    return {
      rect: rm.getBoundingClientRect(),
      scrollHeight: rm.scrollHeight,
      triggers
    };
  });

  console.log('RootsMobile Info:', JSON.stringify(info, null, 2));

  // Let's scroll to the exact position of user's screenshot 1
  await page.evaluate(() => {
    document.getElementById('RootsMobile')?.scrollIntoView();
  });
  await page.waitForTimeout(1500);

  // Take screenshot at start of RootsMobile
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_roots_exact_screen1.png' });

  // Now scroll 800px down and take screenshot
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_roots_exact_screen2.png' });

  // Now scroll 1600px down and take screenshot
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/belgrade_roots_exact_screen3.png' });

  await browser.close();
}

main().catch(console.error);

