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
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(5178, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5178/retail-spaces.html', { waitUntil: 'domcontentloaded' });

  const parents = await page.evaluate(() => {
    let curr = document.querySelector('#footer .heading-2');
    const list = [];
    while (curr) {
      list.push({
        tag: curr.tagName,
        id: curr.id,
        className: curr.className,
        color: window.getComputedStyle(curr).color
      });
      curr = curr.parentElement;
    }
    return list;
  });

  console.log('Inheritance chain:', parents);
  await browser.close();
  server.close();
});

