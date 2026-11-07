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

server.listen(5182, async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  // 1. Desktop screenshot of retail-spaces.html footer
  const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await pageDesktop.goto('http://localhost:5182/retail-spaces.html', { waitUntil: 'networkidle' });
  const footerDesktop = await pageDesktop.$('#footer');
  if (footerDesktop) {
    await footerDesktop.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(600);
    await pageDesktop.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/retail_footer_desktop_verified.png' });
    console.log('Saved retail_footer_desktop_verified.png');
  }

  // 2. Mobile screenshot of retail-spaces.html footer
  const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true });
  await pageMobile.goto('http://localhost:5182/retail-spaces.html', { waitUntil: 'networkidle' });
  const footerMobile = await pageMobile.$('#footer');
  if (footerMobile) {
    await footerMobile.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(600);
    await pageMobile.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/retail_footer_mobile_verified.png' });
    console.log('Saved retail_footer_mobile_verified.png');
  }

  await browser.close();
  server.close();
});
