import { chromium } from 'playwright-core';

async function checkRule() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/business.html', { waitUntil: 'networkidle' });
  
  const rules = await page.evaluate(() => {
    const el = document.querySelector('#footer .heading-2');
    const matched = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && el.matches(rule.selectorText)) {
            matched.push({ selector: rule.selectorText, cssText: rule.cssText });
          }
        }
      } catch (e) {}
    }
    return matched;
  });

  console.log('Matched rules on business.html:', rules);
  await browser.close();
}

checkRule().catch(console.error);
