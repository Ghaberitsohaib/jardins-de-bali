import { chromium, devices } from 'playwright-core';

async function checkRules() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const iPhone = devices['iPhone 14 Pro'];
  const context = await browser.newContext({
    ...iPhone
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const matched = await page.evaluate(() => {
    const hero = document.getElementById('Hero');
    const trigger = hero ? hero.querySelector('.trigger') : null;
    const bg = hero ? hero.querySelector('.background') : null;

    function getApplied(el) {
      if (!el) return [];
      const rules = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && el.matches(rule.selectorText)) {
              rules.push({ selector: rule.selectorText, css: rule.cssText });
            }
          }
        } catch (e) {}
      }
      return rules;
    }

    return {
      heroRules: getApplied(hero),
      triggerRules: getApplied(trigger),
      bgRules: getApplied(bg)
    };
  });

  console.log('Matched rules:', JSON.stringify(matched, null, 2));
  await browser.close();
}

checkRules();
