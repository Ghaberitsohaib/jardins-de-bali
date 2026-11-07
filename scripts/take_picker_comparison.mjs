import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), 'dist', reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let contentType = 'text/html';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.css')) contentType = 'text/css';
    if (filePath.endsWith('.webp')) contentType = 'image/webp';
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
    if (filePath.endsWith('.png')) contentType = 'image/png';
    if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(5185, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const widths = [1280, 1440, 1920];

  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:5185/retail-spaces.html', { waitUntil: 'networkidle' });
    const picker = await page.$('#Picker');
    if (picker) {
      await picker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/retail_picker_${w}.png` });
      console.log(`Saved retail_picker_${w}.png`);
    }

    await page.goto('http://localhost:5185/residences.html', { waitUntil: 'networkidle' });
    const resPicker = await page.$('#Picker');
    if (resPicker) {
      await resPicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/residences_picker_${w}.png` });
      console.log(`Saved residences_picker_${w}.png`);
    }
    await page.close();
  }

  await browser.close();
  server.close();
});
