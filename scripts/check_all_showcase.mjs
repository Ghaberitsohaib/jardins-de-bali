import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  for (const id of ['Residences', 'BusinessSpaces', 'Amenities']) {
    const top = await page.evaluate(secId => {
      const el = document.getElementById(secId);
      return el ? window.pageYOffset + el.getBoundingClientRect().top : 0;
    }, id);

    await page.evaluate(y => window.scrollTo(0, y), top);
    await page.waitForTimeout(2000);

    const data = await page.evaluate(secId => {
      const el = document.getElementById(secId);
      const bg = el ? el.querySelector('.background') : null;
      return {
        secId,
        secTop: el.getBoundingClientRect().top,
        bgTop: bg ? bg.getBoundingClientRect().top : null,
        bgBottom: bg ? bg.getBoundingClientRect().bottom : null,
      };
    }, id);
    console.log(id, data);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/check_${id}.png` });
  }

  await browser.close();
}

main().catch(console.error);

