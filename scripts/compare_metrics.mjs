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

server.listen(5184, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // Test at 1920 width
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // 1. Measure residences.html
  await page.goto('http://localhost:5184/residences.html', { waitUntil: 'networkidle' });
  const resMetrics = await page.evaluate(() => {
    const container = document.querySelector('.picker-container');
    const sidebar = document.querySelector('.picker-sidebar');
    const main = document.querySelector('.picker-results-main');
    const grid = document.querySelector('#residencesGrid');
    return {
      windowWidth: window.innerWidth,
      container: container ? container.getBoundingClientRect() : null,
      sidebar: sidebar ? sidebar.getBoundingClientRect() : null,
      main: main ? main.getBoundingClientRect() : null,
      grid: grid ? grid.getBoundingClientRect() : null
    };
  });
  console.log('=== RESIDENCES METRICS ===', JSON.stringify(resMetrics, null, 2));

  // 2. Measure retail-spaces.html
  await page.goto('http://localhost:5184/retail-spaces.html', { waitUntil: 'networkidle' });
  const retMetrics = await page.evaluate(() => {
    const container = document.querySelector('.retail-picker-container');
    const sidebar = document.querySelector('.picker-sidebar');
    const main = document.querySelector('.retail-picker-container > div:last-child');
    const grid = document.querySelector('#retailGrid');
    return {
      windowWidth: window.innerWidth,
      container: container ? container.getBoundingClientRect() : null,
      sidebar: sidebar ? sidebar.getBoundingClientRect() : null,
      main: main ? main.getBoundingClientRect() : null,
      grid: grid ? grid.getBoundingClientRect() : null
    };
  });
  console.log('=== RETAIL METRICS ===', JSON.stringify(retMetrics, null, 2));

  await browser.close();
  server.close();
});
