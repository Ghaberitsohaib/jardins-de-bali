import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Scroll to #Amenities
  const amenTop = await page.evaluate(() => {
    const el = document.getElementById('Amenities');
    if (!el) return null;
    return window.pageYOffset + el.getBoundingClientRect().top;
  });

  console.log('amenTop:', amenTop);

  if (amenTop != null) {
    await page.evaluate(y => window.scrollTo(0, y), amenTop);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/desktop_amenities_current.png' });

    // Inspect elements at top of screen
    const info = await page.evaluate(() => {
      const amen = document.getElementById('Amenities');
      const prev = amen.previousElementSibling;
      const prevPrev = prev ? prev.previousElementSibling : null;
      const bgImg = amen.querySelector('.background');
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      return {
        amenRect: amen.getBoundingClientRect(),
        prevRect: prev ? prev.getBoundingClientRect() : null,
        prevId: prev ? prev.id : null,
        prevPrevId: prevPrev ? prevPrev.id : null,
        bgImgRect: bgImg ? bgImg.getBoundingClientRect() : null,
        bgImgStyle: bgImg ? {
          top: window.getComputedStyle(bgImg).top,
          transform: window.getComputedStyle(bgImg).transform,
        } : null,
        bodyBg
      };
    });
    console.log('Desktop info:', JSON.stringify(info, null, 2));
  }

  await browser.close();
}

main().catch(console.error);

