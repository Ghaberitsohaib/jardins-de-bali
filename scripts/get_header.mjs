import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'networkidle', timeout: 30000 });
  const data = await page.evaluate(() => {
    const headerPill = document.querySelector('div.fixed.top-6');
    const menuBtn = headerPill ? headerPill.querySelector('button') : null;
    return {
      headerHtml: headerPill ? headerPill.outerHTML.slice(0, 1500) : null,
      menuBtnHtml: menuBtn ? menuBtn.outerHTML : null,
      menuBtnComputed: menuBtn ? {
        border: window.getComputedStyle(menuBtn).border,
        borderRadius: window.getComputedStyle(menuBtn).borderRadius,
        padding: window.getComputedStyle(menuBtn).padding,
        width: window.getComputedStyle(menuBtn).width,
        height: window.getComputedStyle(menuBtn).height,
      } : null
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

main().catch(console.error);

