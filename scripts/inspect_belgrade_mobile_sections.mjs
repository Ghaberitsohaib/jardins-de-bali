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

  const mobileElements = await page.evaluate(() => {
    // Find all sections or elements with md:hidden or visible inside main on mobile
    const main = document.querySelector('main') || document.body;
    const children = Array.from(main.children);
    return children.map(c => ({
      tag: c.tagName,
      id: c.id,
      className: c.className,
      rect: c.getBoundingClientRect(),
      htmlPreview: c.outerHTML.slice(0, 400)
    }));
  });

  console.log('--- MOBILE SECTIONS ---');
  console.log(JSON.stringify(mobileElements, null, 2));

  await browser.close();
}

main().catch(console.error);

