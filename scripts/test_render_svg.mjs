import fs from 'fs';
import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage();
  
  const svgRoof = fs.readFileSync('public/icons/baytimmo-roof-symbol.svg', 'utf8');
  const svgGold = fs.readFileSync('public/icons/baytimmo-official-gold.svg', 'utf8');
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #10150F; margin: 40px; color: #FAF7EF; font-family: sans-serif; display: flex; flex-direction: column; gap: 40px; align-items: center; }
        .box { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(197, 168, 128, 0.3); text-align: center; }
        .roof-box { width: 300px; height: 120px; color: #C5A880; }
        .roof-box svg { width: 100%; height: 100%; }
        .gold-box { width: 500px; }
      </style>
    </head>
    <body>
      <div class="box">
        <h3>Roof Emblem (public/icons/baytimmo-roof-symbol.svg)</h3>
        <div class="roof-box">${svgRoof}</div>
      </div>
      <div class="box">
        <h3>Official Full Vector (public/icons/baytimmo-official-gold.svg)</h3>
        <div class="gold-box">${svgGold}</div>
      </div>
    </body>
    </html>
  `);
  
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_extracted_svg.png' });
  await browser.close();
  console.log('Screenshot saved to test_extracted_svg.png');
})();
