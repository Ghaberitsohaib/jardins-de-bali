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

  for (let offset = 0; offset <= 1200; offset += 300) {
    await page.evaluate(y => window.scrollTo(0, y), instTop + offset);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/local_inst_${offset}.png` });
  }

  // Also log the elements and styles inside #Installment
  const debugData = await page.evaluate(() => {
    const sec = document.getElementById('Installment');
    if (!sec) return 'No #Installment found';
    const trigger = sec.querySelector('.installment-trigger');
    const revImg = sec.querySelector('.installment-reveal-image');
    const revContentDesktop = sec.querySelector('.installment-reveal-content:not(.max-md\\:block)');
    const revContentMobile = sec.querySelector('.installment-reveal-content.max-md\\:block');
    const imgs = Array.from(sec.querySelectorAll('img')).map(img => ({
      src: img.src,
      className: img.className,
      rect: img.getBoundingClientRect(),
      computedTop: window.getComputedStyle(img).top,
      computedTransform: window.getComputedStyle(img).transform,
      computedDisplay: window.getComputedStyle(img).display
    }));
    return {
      secRect: sec.getBoundingClientRect(),
      triggerRect: trigger ? trigger.getBoundingClientRect() : null,
      revImgRect: revImg ? revImg.getBoundingClientRect() : null,
      revImgClip: revImg ? window.getComputedStyle(revImg).clipPath : null,
      revContentDesktopDisplay: revContentDesktop ? window.getComputedStyle(revContentDesktop).display : null,
      revContentMobileDisplay: revContentMobile ? window.getComputedStyle(revContentMobile).display : null,
      revContentMobileClip: revContentMobile ? window.getComputedStyle(revContentMobile).clipPath : null,
      imgs
    };
  });
  console.log('DEBUG DATA:', JSON.stringify(debugData, null, 2));

  await browser.close();
}

main().catch(console.error);

