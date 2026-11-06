import { chromium, devices } from 'playwright-core';

async function verifyAll() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const iPhone = devices['iPhone 14 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    deviceScaleFactor: 2
  });

  const pages = [
    { url: 'http://localhost:5173/retail-spaces.html', name: 'retail' },
    { url: 'http://localhost:5173/residences.html', name: 'residences' },
    { url: 'http://localhost:5173/business.html', name: 'business' },
    { url: 'http://localhost:5173/ventes.html', name: 'ventes' },
    { url: 'http://localhost:5173/about-the-investor.html', name: 'about' },
    { url: 'http://localhost:5173/', name: 'home' }
  ];

  for (const p of pages) {
    const page = await context.newPage();
    await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const data = await page.evaluate(() => {
      const hero = document.getElementById('Hero') || document.querySelector('.residences-hero') || document.getElementById('arborStage');
      const nextSection = hero ? hero.nextElementSibling || document.getElementById('Picker') || document.querySelector('section:nth-of-type(2)') : null;
      const metaTheme = document.querySelector('meta[name="theme-color"]');

      return {
        viewportHeight: window.innerHeight,
        heroHeight: hero ? hero.offsetHeight : null,
        heroBottom: hero ? hero.getBoundingClientRect().bottom : null,
        nextSectionTop: nextSection ? nextSection.getBoundingClientRect().top : null,
        htmlBg: window.getComputedStyle(document.documentElement).backgroundColor,
        themeColor: metaTheme ? metaTheme.content : null
      };
    });

    console.log(`=== ${p.name} ===`, data);

    await page.screenshot({
      path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_full_${p.name}.png`,
      clip: { x: 0, y: 0, width: 393, height: 660 }
    });

    await page.close();
  }

  await browser.close();
}

verifyAll();

