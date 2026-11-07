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

server.listen(5175, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const pages = [
    'index.html',
    'business.html',
    'retail-spaces.html',
    'residences.html',
    'about-the-investor.html',
    'contact.html',
    'ventes.html',
    'maquette3d.html'
  ];

  for (const p of pages) {
    try {
      await page.goto(`http://localhost:5175/${p}`, { waitUntil: 'domcontentloaded' });
      const footer = await page.$('#footer');
      if (footer) {
        const titleEl = await page.$('#footer .heading-2, #footer h2, #footer .font-light.uppercase');
        const color = titleEl ? await page.evaluate(el => window.getComputedStyle(el).color, titleEl) : 'no title';
        const text = titleEl ? await page.evaluate(el => el.textContent.trim().substring(0, 30), titleEl) : '';
        console.log(`${p}: color=${color} text="${text}"`);
      } else {
        console.log(`${p}: no #footer found`);
      }
    } catch (e) {
      console.log(`${p}: error ${e.message}`);
    }
  }

  await browser.close();
  server.close();
});

