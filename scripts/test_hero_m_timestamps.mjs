import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.setContent(`
    <body style="margin:0;background:#000;height:100vh;">
      <video id="v" src="http://localhost:5173/home/hero-m.webm" muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>
    </body>
  `);

  for (const t of [4, 8, 12, 14]) {
    await page.evaluate((time) => {
      const v = document.getElementById('v');
      v.currentTime = time;
    }, t);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_hero_m_${t}s.png` });
  }

  await browser.close();
  console.log('done multi-timestamp screenshots');
}

main().catch(console.error);

