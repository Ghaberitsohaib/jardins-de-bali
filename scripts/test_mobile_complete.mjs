import { chromium, devices } from 'playwright-core';

async function testMobileComplete() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.addStyleTag({
    content: `
      /* Dark luxury vignette overlay on #BusinessSpaces */
      #BusinessSpaces {
        position: relative;
        background-color: #10150F !important;
        overflow: hidden;
      }
      #BusinessSpaces .trigger {
        position: relative;
      }
      #BusinessSpaces .trigger::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(16, 21, 15, 0.75) 0%,
          rgba(16, 21, 15, 0.15) 30%,
          rgba(16, 21, 15, 0.35) 60%,
          rgba(16, 21, 15, 0.9) 88%,
          #10150F 100%
        );
        pointer-events: none;
        z-index: 1;
      }

      @media (max-width: 1024px) {
        #BusinessSpaces .trigger {
          min-height: 100lvh !important;
          height: auto !important;
          padding-top: 5rem !important;
          padding-bottom: 3.5rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        #BusinessSpaces .wrapper {
          position: relative !important;
          z-index: 2 !important;
          width: 100% !important;
          max-width: 360px !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1.25rem !important;
          padding: 0 1rem !important;
        }
        #BusinessSpaces h2.hero {
          font-family: var(--font-editorialOld, 'Playfair Display', serif) !important;
          font-size: clamp(2rem, 6.5vw, 2.5rem) !important;
          line-height: 1.08 !important;
          color: #FAF7EF !important;
          width: 100% !important;
          text-align: left !important;
          margin-bottom: 0 !important;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
        }
        #BusinessSpaces .paragraph {
          width: 100% !important;
        }
        /* Mobile Luxury Frosted Glass Card */
        .biz-mobile-card {
          background: rgba(16, 21, 15, 0.72) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(197, 168, 128, 0.28) !important;
          border-radius: 1.25rem !important;
          padding: 1.35rem !important;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(197, 168, 128, 0.2) !important;
        }
        .biz-mobile-card p {
          color: #E8DFD0 !important;
          font-size: 0.925rem !important;
          line-height: 1.62 !important;
          margin: 0 !important;
          font-family: var(--font-workSans, sans-serif) !important;
        }
        .biz-kicker-mobile {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          font-family: var(--font-workSans, sans-serif) !important;
          font-size: 0.6875rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.22em !important;
          text-transform: uppercase !important;
          color: #C5A880 !important;
        }
        .biz-card-footer {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-top: 1rem !important;
          padding-top: 0.85rem !important;
          border-top: 1px solid rgba(197, 168, 128, 0.2) !important;
          font-family: var(--font-workSans, sans-serif) !important;
          font-size: 0.65rem !important;
          letter-spacing: 0.14em !important;
          text-transform: uppercase !important;
          color: #C5A880 !important;
          font-weight: 600 !important;
        }

        /* #BusinessSpacesOptions on Mobile */
        #BusinessSpacesOptions {
          background-color: #10150F !important;
          padding-top: 2rem !important;
          padding-bottom: 4rem !important;
        }
        #BusinessSpacesOptions .retail-spaces-reveal-image {
          clip-path: none !important;
          height: 220px !important;
          margin: 0 1rem 1.75rem 1rem !important;
          width: calc(100% - 2rem) !important;
          border-radius: 1.25rem !important;
          overflow: hidden !important;
          border: 1px solid rgba(197, 168, 128, 0.25) !important;
          box-shadow: 0 16px 36px rgba(0,0,0,0.5) !important;
          position: relative !important;
        }
        #BusinessSpacesOptions .retail-spaces-reveal-image::after {
          content: 'APERÇU ARCHITECTURAL';
          position: absolute;
          bottom: 0.75rem;
          left: 0.85rem;
          background: rgba(16, 21, 15, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(197, 168, 128, 0.3);
          color: #C5A880;
          font-family: var(--font-workSans, sans-serif);
          font-size: 0.5625rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          z-index: 2;
        }
        #BusinessSpacesOptions .retail-spaces-reveal-content {
          clip-path: none !important;
          padding: 0 1.25rem !important;
        }
      }
    `
  });

  await page.evaluate(() => {
    const sec = document.getElementById('BusinessSpaces');
    if (!sec) return;
    const h2 = sec.querySelector('h2');
    const p = sec.querySelector('p.paragraph');
    const wrap = sec.querySelector('.wrapper');

    if (h2 && p) {
      // Add kicker
      let kicker = sec.querySelector('.biz-kicker-mobile');
      if (!kicker) {
        kicker = document.createElement('div');
        kicker.className = 'biz-kicker-mobile';
        kicker.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#C5A880;display:inline-block;"></span> COMMERCIAL & PRESTIGE';
        h2.parentNode.insertBefore(kicker, h2);
      }

      // Wrap in biz-mobile-card
      if (!p.closest('.biz-mobile-card')) {
        const card = document.createElement('div');
        card.className = 'biz-mobile-card';
        p.parentNode.insertBefore(card, p);
        card.appendChild(p);

        const footer = document.createElement('div');
        footer.className = 'biz-card-footer';
        footer.innerHTML = '<span>SURFACES MODULABLES</span><span>•</span><span>PRESTIGE MENARA</span>';
        card.appendChild(footer);
      }
    }
  });

  await page.waitForTimeout(400);

  // Take screenshot of #BusinessSpaces exactly in view
  const bEl = await page.$('#BusinessSpaces');
  if (bEl) {
    await bEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/new_biz_mobile_view.png' });
  }

  // Scroll down by 400px to see the seamless transition into #BusinessSpacesOptions
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/new_biz_scroll_view.png' });

  // Scroll down to options list
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/new_biz_options_view.png' });

  await browser.close();
}

testMobileComplete();
