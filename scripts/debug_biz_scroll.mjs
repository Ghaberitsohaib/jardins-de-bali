import { chromium, devices } from 'playwright-core';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const bizPos = await page.evaluate(() => {
    const el = document.getElementById('BusinessSpaces');
    const opt = document.getElementById('BusinessSpacesOptions');
    return {
      bizTop: el ? el.getBoundingClientRect().top + window.scrollY : null,
      bizHeight: el ? el.offsetHeight : null,
      optTop: opt ? opt.getBoundingClientRect().top + window.scrollY : null,
      optHeight: opt ? opt.offsetHeight : null
    };
  });

  console.log('Positions:', bizPos);

  // Scroll to bizTop - 100, bizTop, bizTop + 200, bizTop + 400
  for (let offset = -100; offset <= 800; offset += 200) {
    await page.evaluate((y) => window.scrollTo(0, y), bizPos.bizTop + offset);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/biz_scroll_${offset}.png`
    });
  }

  await browser.close();
}

run();
