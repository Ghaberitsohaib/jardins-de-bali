import { chromium } from 'playwright-core';

async function diagnose() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const mobCtx = await browser.newContext({
    viewport: { width: 393, height: 852 }, // iPhone 15 / 16 Pro dimensions
    deviceScaleFactor: 3,
    isMobile: true
  });
  const page = await mobCtx.newPage();
  
  await page.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const hero = document.getElementById('Hero');
    const trigger = hero ? hero.querySelector('.trigger') : null;
    const bg = hero ? hero.querySelector('.background') : null;
    const picker = document.getElementById('Picker') || document.querySelector('#Picker, section:nth-of-type(2)');
    const body = document.body;
    const html = document.documentElement;

    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      scrollY: window.scrollY,
      heroRect: hero ? hero.getBoundingClientRect() : null,
      triggerRect: trigger ? trigger.getBoundingClientRect() : null,
      bgRect: bg ? bg.getBoundingClientRect() : null,
      pickerRect: picker ? picker.getBoundingClientRect() : null,
      heroComputedHeight: hero ? window.getComputedStyle(hero).height : null,
      heroComputedMinHeight: hero ? window.getComputedStyle(hero).minHeight : null,
      triggerComputedHeight: trigger ? window.getComputedStyle(trigger).height : null,
      bodyHeight: body.scrollHeight,
      htmlHeight: html.scrollHeight
    };
  });

  console.log('Metrics:', JSON.stringify(metrics, null, 2));

  await page.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/diagnose_iphone_retail.png'
  });

  await browser.close();
}

diagnose();

