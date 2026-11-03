import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, isMobile: true });
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Scroll through the entire page slowly
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    for (let y = 0; y < totalHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
  });

  await page.waitForTimeout(1000);
  console.log('Errors caught during scroll:', errors);

  await browser.close();
}

main().catch(console.error);

