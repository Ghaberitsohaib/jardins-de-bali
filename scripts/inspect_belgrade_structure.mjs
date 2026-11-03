import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true,
  });

  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const headerHtml = await page.evaluate(() => {
    const h = document.querySelector('header');
    return h ? h.outerHTML : 'no header';
  });
  console.log('--- HEADER HTML ---');
  console.log(headerHtml.slice(0, 1000));

  const heroHtml = await page.evaluate(() => {
    const s = document.querySelector('section') || document.querySelector('main > div');
    return s ? s.outerHTML : 'no hero';
  });
  console.log('--- HERO HTML ---');
  console.log(heroHtml.slice(0, 1000));

  const bottomActions = await page.evaluate(() => {
    // find any fixed elements at bottom
    const all = Array.from(document.querySelectorAll('*'));
    const fixedBottom = all.filter(el => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed' && (parseInt(style.bottom) >= 0 || style.bottom === '0px');
    });
    return fixedBottom.map(el => ({
      tag: el.tagName,
      className: el.className,
      html: el.outerHTML.slice(0, 300)
    }));
  });
  console.log('--- FIXED BOTTOM ELEMENTS ---');
  console.log(JSON.stringify(bottomActions, null, 2));

  await browser.close();
}

main().catch(console.error);

