import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('#awwwards', { timeout: 10000 });
  const awwwards = await page.evaluate(() => {
    const el = document.getElementById('awwwards');
    return el ? el.outerHTML : 'none';
  });
  console.log('--- AWWWARDS HTML ---');
  console.log(awwwards);
  await browser.close();
}

main().catch(console.error);

