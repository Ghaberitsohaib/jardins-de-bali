import { chromium } from 'playwright-core';

async function check() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const resolutions = [
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 }
  ];

  for (const pageName of ['residences.html', 'business.html']) {
    console.log('=== Page: ' + pageName + ' ===');
    for (const res of resolutions) {
      const page = await browser.newPage({ viewport: res, isMobile: res.width < 600 });
      await page.goto('http://localhost:5173/' + pageName, { waitUntil: 'networkidle' });
      const data = await page.evaluate(() => {
        const btn = document.querySelector('.hero-scroll-down-btn');
        const metrics = document.querySelector('.residences-metrics-bar, .business-metrics-bar');
        if (!btn || !metrics) return null;
        const br = btn.getBoundingClientRect();
        const mr = metrics.getBoundingClientRect();
        return {
          windowHeight: window.innerHeight,
          btn: { top: Math.round(br.top), bottom: Math.round(br.bottom), left: Math.round(br.left) },
          metrics: { top: Math.round(mr.top), bottom: Math.round(mr.bottom), left: Math.round(mr.left), right: Math.round(mr.right) },
          verticalDistance: Math.round(br.top - mr.bottom),
          overlap: !(br.top >= mr.bottom || br.bottom <= mr.top)
        };
      });
      console.log(res.width + 'x' + res.height + ':', data);
      await page.close();
    }
  }

  await browser.close();
}

check().catch(console.error);
