import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  
  const el = await page.locator('#Installment');
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'local_inst_current.png' });
  
  const info = await page.evaluate(() => {
    const sec = document.querySelector('#Installment');
    const revImg = sec.querySelector('.installment-reveal-image');
    const container = revImg.querySelector('.relative.h-full.w-full');
    const imgs = Array.from(sec.querySelectorAll('.installment-parallax')).map(img => ({
      src: img.src,
      display: getComputedStyle(img).display,
      top: getComputedStyle(img).top,
      transform: getComputedStyle(img).transform,
      height: img.clientHeight,
      naturalHeight: img.naturalHeight,
      offsetTop: img.offsetTop,
      offsetParent: img.offsetParent ? img.offsetParent.className : null
    }));
    return {
      secHeight: sec.clientHeight,
      revImgHeight: revImg.clientHeight,
      containerHeight: container ? container.clientHeight : null,
      imgs
    };
  });
  console.log('Info:', JSON.stringify(info, null, 2));
  await browser.close();
})();

