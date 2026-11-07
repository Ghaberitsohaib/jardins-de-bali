import { chromium, devices } from 'playwright-core';

async function verifyScreens() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  // Mobile context (iPhone 14 Pro: 393x852, dpr 2)
  const mobileContext = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await mobileContext.newPage();

  // Test business.html
  await page.goto('http://localhost:4173/business.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of hero
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_mobile_hero_fr.png' });
  console.log('Saved business_mobile_hero_fr.png');

  // Scroll to Options section
  const options = await page.$('#BusinessSpacesOptions');
  if (options) {
    await options.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_mobile_options_fr.png' });
    console.log('Saved business_mobile_options_fr.png');
  }

  // Scroll to Panorama / Restaurant section
  const panorama = await page.$('#Panorama');
  if (panorama) {
    await panorama.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_mobile_panorama_fr.png' });
    console.log('Saved business_mobile_panorama_fr.png');
  }

  // Scroll to Footer newsletter
  const footer = await page.$('#footer');
  if (footer) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/business_mobile_footer_fr.png' });
    console.log('Saved business_mobile_footer_fr.png');
  }

  // Test index.html
  await page.goto('http://localhost:4173/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const bizSec = await page.$('#BusinessSpaces');
  if (bizSec) {
    await bizSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/index_mobile_biz_fr.png' });
    console.log('Saved index_mobile_biz_fr.png');
  }

  await browser.close();
  console.log('All verification screenshots saved successfully.');
}

verifyScreens().catch(err => {
  console.error(err);
  process.exit(1);
});
