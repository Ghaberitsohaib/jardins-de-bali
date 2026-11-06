import { chromium, devices } from 'playwright-core';

async function testConcept2Live() {
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

  // Apply Option 2 styles
  await page.addStyleTag({
    content: `
      /* =========================================================
         OPTION 2: MINIMALIST HAUTE COUTURE (ZERO BOXES / ZERO CADRES)
         ========================================================= */
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
        background: radial-gradient(
          circle at 50% 25%,
          rgba(16, 21, 15, 0.25) 0%,
          rgba(16, 21, 15, 0.65) 60%,
          #10150F 100%
        );
        pointer-events: none;
        z-index: 1;
      }

      .biz-couture-kicker {
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #C5A880;
        display: block;
        margin-bottom: 0.5rem;
      }

      .biz-quote-mark {
        font-family: 'Playfair Display', serif;
        font-size: 3.5rem;
        line-height: 0.5;
        color: #C5A880;
        opacity: 0.6;
        display: block;
        margin-bottom: 0.25rem;
      }

      .biz-script-quote {
        font-family: 'Pinyon Script', cursive !important;
        font-size: clamp(2rem, 6.5vw, 2.45rem);
        line-height: 1.25;
        color: #C5A880;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.85);
        margin-bottom: 0.85rem;
      }

      @media (max-width: 1024px) {
        #BusinessSpaces .trigger {
          min-height: 100lvh !important;
          height: auto !important;
          padding-top: 5rem !important;
          padding-bottom: 3rem !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
        }

        #BusinessSpaces .wrapper {
          position: relative !important;
          z-index: 2 !important;
          width: 100% !important;
          max-width: 380px !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1.5rem !important;
          padding: 0 1.25rem !important;
        }

        #BusinessSpaces h2.hero {
          font-family: var(--font-editorialOld, 'Playfair Display', serif) !important;
          font-size: clamp(2.15rem, 7vw, 2.75rem) !important;
          line-height: 1.05 !important;
          color: #FAF7EF !important;
          width: 100% !important;
          text-align: left !important;
          margin-bottom: 0 !important;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6) !important;
        }

        .biz-couture-statement {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .biz-couture-statement .paragraph {
          width: 100% !important;
          font-family: var(--font-workSans, sans-serif) !important;
          font-size: 0.925rem !important;
          line-height: 1.7 !important;
          color: rgba(250, 247, 239, 0.92) !important;
          letter-spacing: 0.015em !important;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8) !important;
        }

        /* #BusinessSpacesOptions on Mobile - ZERO BOXES */
        #BusinessSpacesOptions {
          background-color: #10150F !important;
          padding-top: 1rem !important;
          padding-bottom: 4rem !important;
        }

        #BusinessSpacesOptions .retail-spaces-reveal-image {
          clip-path: none !important;
          height: 250px !important;
          margin: 0 !important;
          width: 100% !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          position: relative !important;
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%) !important;
          mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%) !important;
        }

        #BusinessSpacesOptions .retail-spaces-reveal-content {
          clip-path: none !important;
          padding: 0 1.25rem !important;
        }
      }
    `
  });

  // Update DOM in page for testing
  await page.evaluate(() => {
    const sec = document.getElementById('BusinessSpaces');
    if (!sec) return;

    // Remove old card if present
    const oldCard = sec.querySelector('.biz-mobile-card');
    const p = sec.querySelector('p.paragraph');
    const h2 = sec.querySelector('h2.hero');
    const wrap = sec.querySelector('.wrapper');

    if (h2 && p) {
      // Remove any existing badge
      const oldKicker = sec.querySelector('.biz-kicker-mobile');
      if (oldKicker) oldKicker.remove();

      // Create couture header
      let header = sec.querySelector('.biz-couture-header');
      if (!header) {
        header = document.createElement('div');
        header.className = 'biz-couture-header';
        header.innerHTML = '<span class="biz-couture-kicker">II · COLLECTION AFFAIRES & COMMERCE</span>';
        h2.parentNode.insertBefore(header, h2);
        header.appendChild(h2);
      }

      // Create couture statement
      let stmt = sec.querySelector('.biz-couture-statement');
      if (!stmt) {
        stmt = document.createElement('div');
        stmt.className = 'biz-couture-statement';
        stmt.innerHTML = `
          <span class="biz-quote-mark">“</span>
          <p class="biz-script-quote font-script">More than an address — a statement of vision &amp; prestige.</p>
        `;
        const pParent = p.parentNode;
        pParent.insertBefore(stmt, p);
        stmt.appendChild(p);
      }

      // Remove old card wrapper if exists
      if (oldCard && oldCard !== stmt) {
        oldCard.replaceWith(stmt);
      }
    }

    // Remove preview badge on options
    const bBadge = document.querySelector('.biz-preview-badge');
    if (bBadge) bBadge.remove();
  });

  await page.waitForTimeout(500);

  // Take screenshot of #BusinessSpaces
  const bEl = await page.$('#BusinessSpaces');
  if (bEl) {
    await bEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_c2_live_hero.png' });
  }

  // Scroll 400px down to see transition
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/test_c2_live_scroll.png' });

  await browser.close();
  console.log('Concept 2 live tested successfully!');
}

testConcept2Live();
