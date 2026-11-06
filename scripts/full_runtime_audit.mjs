import { chromium } from 'playwright-core';

const pages = [
  { url: 'http://localhost:5173/index.html', name: 'Home' },
  { url: 'http://localhost:5173/residences.html', name: 'Residences' },
  { url: 'http://localhost:5173/business.html', name: 'Business' },
  { url: 'http://localhost:5173/retail-spaces.html', name: 'Retail Spaces' },
  { url: 'http://localhost:5173/ventes.html', name: 'Ventes' },
  { url: 'http://localhost:5173/maquette3d.html', name: 'Maquette 3D' },
  { url: 'http://localhost:5173/about-the-investor.html', name: 'About the Investor' },
  { url: 'http://localhost:5173/contact.html', name: 'Contact' }
];

const viewports = [
  { name: 'Mobile (390x844)', width: 390, height: 844, isMobile: true },
  { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false }
];

async function audit() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const auditReport = [];

  for (const pageInfo of pages) {
    const pageResult = {
      name: pageInfo.name,
      url: pageInfo.url,
      consoleErrors: [],
      networkErrors: [],
      mobileOverflow: false,
      desktopOverflow: false,
      menuToggleWorks: false,
      loadTimeMs: 0
    };

    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile
      });

      page.on('console', msg => {
        if (msg.type() === 'error') {
          pageResult.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
        }
      });

      page.on('requestfailed', req => {
        pageResult.networkErrors.push(`[${vp.name}] ${req.url()} - ${req.failure()?.errorText}`);
      });

      page.on('response', res => {
        if (res.status() >= 400) {
          pageResult.networkErrors.push(`[${vp.name}] ${res.status()} ${res.url()}`);
        }
      });

      const startTime = Date.now();
      try {
        await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1000);
      } catch (err) {
        pageResult.consoleErrors.push(`Load error: ${err.message}`);
      }
      const elapsed = Date.now() - startTime;
      if (!vp.isMobile) pageResult.loadTimeMs = elapsed;

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (vp.isMobile) {
        pageResult.mobileOverflow = overflow;
        // Test menu open
        const menuBtn = await page.$('#arborMenuBtn, .arbor-menu-btn, button[aria-label=\"Menu\"]');
        if (menuBtn) {
          try {
            await menuBtn.click();
            await page.waitForTimeout(300);
            const isOpen = await page.evaluate(() => {
              const menu = document.querySelector('.arbor-menu-collapse, #arborDropdownMenu');
              return menu ? window.getComputedStyle(menu).display !== 'none' && window.getComputedStyle(menu).visibility !== 'hidden' : false;
            });
            pageResult.menuToggleWorks = isOpen;
          } catch (e) {
            pageResult.menuToggleWorks = false;
          }
        }
      } else {
        pageResult.desktopOverflow = overflow;
      }

      await page.close();
    }

    auditReport.push(pageResult);
  }

  await browser.close();
  console.log(JSON.stringify(auditReport, null, 2));
}

audit().catch(console.error);

