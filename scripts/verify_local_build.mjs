import { chromium } from 'playwright-core';
import { spawn } from 'child_process';

async function main() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true, stdio: 'pipe' });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await context.newPage();

    console.log('Navigating to http://localhost:4173/retail-spaces.html...');
    await page.goto('http://localhost:4173/retail-spaces.html', { waitUntil: 'networkidle' });

    // Verify card count
    const cardCount = await page.$$eval('#retailGrid .retail-card-item', cards => cards.length);
    console.log('Retail cards found:', cardCount);

    // Verify images have loaded
    const imgStatus = await page.$$eval('#retailGrid .retail-card-item img', imgs =>
      imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }))
    );
    console.log('Image status in cards:', imgStatus);

    // Capture screenshot of #Picker
    const picker = await page.$('#Picker');
    if (picker) {
      await picker.screenshot({
        path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/local_verified_retail_plans.png'
      });
      console.log('Saved local_verified_retail_plans.png');
    }

    // Click card 1
    const firstCard = await page.$('#retailGrid .retail-card-item');
    if (firstCard) {
      await firstCard.click();
      await page.waitForTimeout(600);
      const isModalActive = await page.$eval('#unitDetailBackdrop', el => el.classList.contains('is-active'));
      console.log('Is unit detail modal active after click:', isModalActive);

      await page.screenshot({
        path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/local_modal_opened.png'
      });
      console.log('Saved local_modal_opened.png');
    }

    // Now test mobile viewport (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    // Close modal
    const closeBtn = await page.$('#closeUnitModalBtn');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/local_mobile_verified.png'
    });
    console.log('Saved local_mobile_verified.png');

    await browser.close();
  } finally {
    preview.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

