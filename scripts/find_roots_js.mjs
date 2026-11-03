import { chromium } from 'playwright-core';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  const jsUrls = [];
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('.js') && url.includes('belgradearbor.rs')) {
      jsUrls.push(url);
    }
  });

  await page.goto('https://belgradearbor.rs/en', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  console.log(`Found ${jsUrls.length} JS files.`);

  for (const url of jsUrls) {
    try {
      const resp = await page.request.get(url);
      const text = await resp.text();
      if (text.includes('RootsMobile') || text.includes('roots-scroller')) {
        console.log('FOUND MATCH IN:', url);
        fs.writeFileSync('scripts/matched_roots_chunk.js', text);
      }
    } catch (e) {
      console.error('Error fetching', url, e.message);
    }
  }

  await browser.close();
  console.log('Search finished.');
}

main().catch(console.error);

