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

server.listen(5174, async () => {
  console.log('Test server running at http://localhost:5174');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Check business.html
  await page.goto('http://localhost:5174/business.html', { waitUntil: 'networkidle' });
  const bizTitle = await page.$eval('#footer .heading-2', el => ({ text: el.textContent.trim(), color: window.getComputedStyle(el).color }));
  const bizSmall = await page.$eval('#footer .small', el => ({ text: el.textContent.trim().substring(0, 40), color: window.getComputedStyle(el).color }));
  console.log('business.html #footer:', bizTitle, bizSmall);

  // Check retail-spaces.html
  await page.goto('http://localhost:5174/retail-spaces.html', { waitUntil: 'networkidle' });
  const retTitle = await page.$eval('#footer .heading-2', el => ({ text: el.textContent.trim(), color: window.getComputedStyle(el).color }));
  const retSmall = await page.$eval('#footer .small', el => ({ text: el.textContent.trim().substring(0, 40), color: window.getComputedStyle(el).color }));
  console.log('retail-spaces.html #footer:', retTitle, retSmall);

  // Take screenshot of retail-spaces.html footer
  const footer = await page.$('#footer');
  if (footer) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_footer_current.png' });
    console.log('Saved test_footer_current.png');
  }

  await browser.close();
  server.close();
});

