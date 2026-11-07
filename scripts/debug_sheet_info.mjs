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

server.listen(5181, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5181/retail-spaces.html', { waitUntil: 'domcontentloaded' });

  const info = await page.evaluate(() => {
    const list = [];
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === 'body' && rule.cssText.includes('!important')) {
            list.push({
              sheetIndex: i,
              href: sheet.href,
              ownerNodeTag: sheet.ownerNode?.tagName,
              ownerNodeId: sheet.ownerNode?.id,
              ownerNodeParent: sheet.ownerNode?.parentElement?.tagName,
              css: rule.cssText
            });
          }
        }
      } catch (e) {}
    }
    return list;
  });

  console.log('Sheet info:', info);
  await browser.close();
  server.close();
});
