import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const top = await page.evaluate(() => {
    const el = document.getElementById('BusinessSpaces');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  await page.evaluate(y => window.scrollTo(0, y), top);
  await page.waitForTimeout(1000);

  // Remove the video
  await page.evaluate(() => {
    const sec = document.getElementById('BusinessSpaces');
    const wrap = sec.querySelector('.videoWrap');
    if (wrap) wrap.parentElement.remove();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_business_mobile_after.png' });

  await browser.close();
}

main().catch(console.error);

