import { chromium } from 'playwright-core';
import fs from 'fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  console.log('Loading maquette3d.html...');
  await page.goto('http://localhost:5173/maquette3d.html');
  await page.waitForTimeout(2000);

  console.log('Clicking Localisation...');
  await page.click('[data-vertex-mode="plan"]');

  console.log('Waiting for loader to hide...');
  await page.waitForSelector('#viewerLoader', { state: 'hidden', timeout: 60000 });
  await page.waitForTimeout(6000);

  const shotPath = 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/inspect_localisation.png';
  await page.screenshot({ path: shotPath });
  const stat = fs.statSync(shotPath);
  console.log(`Saved ${shotPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);

  // Inspect frames and content
  const planFrame = page.frames().find(f => f.url().includes('plan'));
  if (planFrame) {
    console.log('Plan Frame URL:', planFrame.url());
    const content = await planFrame.content();
    console.log('Plan frame content length:', content.length);
  }

  await browser.close();
}

main().catch(console.error);

