import { chromium } from 'playwright-core';

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const testViewports = [
    { name: 'iPhone 14 Safari Viewport', width: 390, height: 715 },
    { name: 'iPhone 14 Full Screen', width: 390, height: 844 },
    { name: 'iPhone SE Safari Viewport', width: 375, height: 580 },
    { name: 'iPhone 15 Pro Max', width: 430, height: 780 }
  ];

  for (const vp of testViewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    await page.goto('http://localhost:5173/business.html', { waitUntil: 'networkidle' });

    const data = await page.evaluate(() => {
      const getB = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), left: Math.round(r.left), width: Math.round(r.width) };
      };
      return {
        windowHeight: window.innerHeight,
        header: getB('.arbor-header'),
        title: getB('.business-hero-title'),
        paragraph: getB('.business-hero-p'),
        metrics: getB('.business-metrics-bar'),
        scrollBtn: getB('.hero-scroll-down-btn')
      };
    });

    console.log('--------------------------------------------------');
    console.log(vp.name + ' (' + vp.width + 'x' + vp.height + ')');
    console.log('Header:', data.header);
    console.log('Title:', data.title);
    console.log('Metrics:', data.metrics);
    console.log('ScrollBtn:', data.scrollBtn);
    const gap = data.title.top - data.header.bottom;
    console.log('Clearance gap (Title.top - Header.bottom): ' + gap + 'px -> ' + (gap >= 10 ? 'PASS (no overlap)' : 'FAIL'));
    const allFit = data.scrollBtn.bottom <= vp.height + 10;
    console.log('Scroll button visible in viewport: ' + (allFit ? 'PASS' : ('EXCEEDS by ' + (data.scrollBtn.bottom - vp.height) + 'px')));
    const metricsFit = data.metrics.bottom <= vp.height;
    console.log('All 4 Metrics visible in viewport: ' + (metricsFit ? 'PASS' : 'FAIL'));

    if (vp.name.includes('iPhone 14 Safari')) {
      await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/0af7e4c9-1bae-4e02-a9ae-bb70c83e4803/iphone14_safari_view.png' });
    }

    await page.close();
  }

  await browser.close();
}

run().catch(console.error);

