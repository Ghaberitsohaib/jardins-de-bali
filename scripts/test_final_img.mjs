import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.setContent(`
    <body style="margin:0;background:#000;height:100vh;">
      <img src="http://localhost:5173/baytimmo-final.jpeg" style="width:100%;height:100%;object-fit:cover;">
    </body>
  `);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_baytimmo_final_img.png' });
  await browser.close();
  console.log('done baytimmo final test');
}

main().catch(console.error);

