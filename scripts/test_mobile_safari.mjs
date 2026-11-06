import { chromium, devices } from 'playwright-core';

async function testFix() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const iPhone = devices['iPhone 14 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    deviceScaleFactor: 3
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Apply the CSS fix dynamically to test
  await page.evaluate(() => {
    // Add theme-color meta
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#10150F';
    document.head.appendChild(meta);

    const style = document.createElement('style');
    style.id = 'hero-fullscreen-fix';
    style.innerHTML = `
      html {
        background-color: #10150F !important;
      }
      body {
        background-color: #10150F !important;
      }
      #Hero {
        min-height: 100vh !important;
        min-height: 100lvh !important;
        height: 100lvh !important;
        background-color: #10150F !important;
      }
      #Hero .trigger {
        min-height: 100vh !important;
        min-height: 100lvh !important;
        height: 100% !important;
      }
      #Picker {
        background-color: #FDFBEF !important;
        position: relative;
        z-index: 10;
      }
    `;
    document.head.appendChild(style);
  });

  await page.waitForTimeout(300);

  const info = await page.evaluate(() => {
    const hero = document.getElementById('Hero');
    const picker = document.getElementById('Picker');
    return {
      innerHeight: window.innerHeight,
      heroHeight: hero ? hero.offsetHeight : 0,
      heroBounding: hero ? hero.getBoundingClientRect() : null,
      pickerBounding: picker ? picker.getBoundingClientRect() : null,
      htmlBg: window.getComputedStyle(document.documentElement).backgroundColor,
      bodyBg: window.getComputedStyle(document.body).backgroundColor
    };
  });

  console.log('Fixed layout info:', info);

  await page.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_fixed_safari_retail.png'
  });

  await browser.close();
}

testFix();
