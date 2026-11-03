import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  const instTop = await page.evaluate(() => {
    const el = document.getElementById('Installment');
    return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
  });

  // Take screenshot at:
  // 1. Entering installment (offset -200)
  // 2. Mid installment (offset 100)
  // 3. Full installment (offset 400)
  const steps = [-200, 0, 200, 400, 600];
  for (const s of steps) {
    await page.evaluate(y => window.scrollTo(0, y), instTop + s);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/fixed_inst_scroll_${s}.png` });
  }

  await browser.close();
}

main().catch(console.error);

