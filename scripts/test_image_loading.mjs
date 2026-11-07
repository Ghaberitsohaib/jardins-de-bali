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
    console.log('404:', req.url);
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(5176, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure() });
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      failedRequests.push({ url: resp.url(), status: resp.status() });
    }
  });

  await page.goto('http://localhost:5176/retail-spaces.html', { waitUntil: 'networkidle' });

  // Scroll to Picker
  const picker = await page.$('#Picker');
  if (picker) await picker.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Check all images in retailGrid
  const imgStats = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('#retailGrid img'));
    return imgs.map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete
    }));
  });

  console.log('Image stats for first 6 items:');
  imgStats.forEach((s, idx) => {
    console.log(`Card ${idx + 1}: src=${s.src} naturalWidth=${s.naturalWidth} naturalHeight=${s.naturalHeight} complete=${s.complete}`);
  });

  console.log('Failed requests count:', failedRequests.length);
  if (failedRequests.length > 0) {
    console.log('Failed:', failedRequests);
  }

  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/dist_grid_images_check.png' });

  await browser.close();
  server.close();
});
