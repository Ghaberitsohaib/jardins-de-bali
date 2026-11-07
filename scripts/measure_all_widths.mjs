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

server.listen(5186, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const screenWidths = [1280, 1366, 1440, 1536, 1600, 1920];

  for (const w of screenWidths) {
    const page = await browser.newPage({ viewport: { width: w, height: 850 } });

    // Retail
    await page.goto('http://localhost:5186/retail-spaces.html', { waitUntil: 'networkidle' });
    const retData = await page.evaluate(() => {
      const sidebar = document.querySelector('.picker-sidebar');
      const grid = document.querySelector('#retailGrid');
      const sBox = sidebar ? sidebar.getBoundingClientRect() : null;
      const gBox = grid ? grid.getBoundingClientRect() : null;
      return {
        leftMargin: sBox ? sBox.left : null,
        sidebarWidth: sBox ? sBox.width : null,
        gap: (gBox && sBox) ? (gBox.left - sBox.right) : null,
        gridWidth: gBox ? gBox.width : null,
        rightMargin: gBox ? (window.innerWidth - gBox.right) : null
      };
    });

    // Residences
    await page.goto('http://localhost:5186/residences.html', { waitUntil: 'networkidle' });
    const resData = await page.evaluate(() => {
      const sidebar = document.querySelector('.picker-sidebar');
      const grid = document.querySelector('#residencesGrid');
      const sBox = sidebar ? sidebar.getBoundingClientRect() : null;
      const gBox = grid ? grid.getBoundingClientRect() : null;
      return {
        leftMargin: sBox ? sBox.left : null,
        sidebarWidth: sBox ? sBox.width : null,
        gap: (gBox && sBox) ? (gBox.left - sBox.right) : null,
        gridWidth: gBox ? gBox.width : null,
        rightMargin: gBox ? (window.innerWidth - gBox.right) : null
      };
    });

    console.log(`Width ${w}px:`);
    console.log(`  Retail:     leftMargin=${retData.leftMargin.toFixed(1)} rightMargin=${retData.rightMargin.toFixed(1)} diff=${(retData.rightMargin - retData.leftMargin).toFixed(1)}`);
    console.log(`  Residences: leftMargin=${resData.leftMargin.toFixed(1)} rightMargin=${resData.rightMargin.toFixed(1)} diff=${(resData.rightMargin - resData.leftMargin).toFixed(1)}`);

    await page.close();
  }

  await browser.close();
  server.close();
});
