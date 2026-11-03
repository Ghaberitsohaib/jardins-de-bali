import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const debugData = await page.evaluate(() => {
    const sec = document.getElementById('Installment');
    if (!sec) return 'No #Installment found';
    const trigger = sec.querySelector('.installment-trigger');
    const revImg = sec.querySelector('.installment-reveal-image');
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
      revImgRect: revImg ? revImg.getBoundingClientRect() : null,
      imgs
    };
  });
  console.log('BELGRADE LIVE DATA:', JSON.stringify(debugData, null, 2));

  await browser.close();
}

main().catch(console.error);

