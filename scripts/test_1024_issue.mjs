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

server.listen(5187, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const widths = [1024, 1050, 1100, 1150, 1200];

  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.goto('http://localhost:5187/retail-spaces.html', { waitUntil: 'networkidle' });

    const ret = await page.evaluate(() => {
      const sidebar = document.querySelector('.picker-sidebar');
      const grid = document.querySelector('#retailGrid');
      const sBox = sidebar ? sidebar.getBoundingClientRect() : null;
      const gBox = grid ? grid.getBoundingClientRect() : null;
      return {
        sLeft: sBox?.left,
        sWidth: sBox?.width,
        sDisplay: sidebar ? window.getComputedStyle(sidebar).display : null,
        gLeft: gBox?.left,
        gRight: gBox?.right,
        gWidth: gBox?.width,
        windowW: window.innerWidth
      };
    });

    console.log(`Width ${w}: sDisplay=${ret.sDisplay} sLeft=${ret.sLeft} gLeft=${ret.gLeft} gRight=${ret.gRight} rightGap=${ret.windowW - ret.gRight}`);
    await page.close();
  }

  await browser.close();
  server.close();
});
