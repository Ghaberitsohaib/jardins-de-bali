import { chromium, devices } from 'playwright-core';

async function testTransition() {
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

  // Apply the same styles & DOM structure
  await page.addStyleTag({
    content: `
      #BusinessSpaces {
        position: relative;
        background-color: #10150F !important;
      }
      #BusinessSpaces .trigger::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(16, 21, 15, 0.8) 0%,
          rgba(16, 21, 15, 0.4) 35%,
          rgba(16, 21, 15, 0.75) 75%,
          #10150F 100%
        );
        pointer-events: none;
        z-index: 1;
      }

      @media (max-width: 1024px) {
        #BusinessSpaces .trigger {
          min-height: 100lvh !important;
          height: auto !important;
          padding-top: 5.5rem !important;
          padding-bottom: 3.5rem !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }
        #BusinessSpaces .wrapper {
          position: relative !important;
          z-index: 2 !important;
          width: 100% !important;
          max-width: 380px !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1.25rem !important;
        }
        #BusinessSpaces h2.hero {
          font-size: clamp(2rem, 6.5vw, 2.5rem) !important;
          line-height: 1.1 !important;
          color: #FAF7EF !important;
          width: 100% !important;
          text-align: left !important;
          margin-bottom: 0 !important;
        }
        .biz-intro-card-mobile {
          background: rgba(16, 21, 15, 0.75) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(197, 168, 128, 0.3) !important;
          border-radius: 1.25rem !important;
          padding: 1.35rem !important;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(197, 168, 128, 0.2) !important;
        }
        .biz-intro-card-mobile p {
          color: #E8DFD0 !important;
          font-size: 0.9375rem !important;
          line-height: 1.65 !important;
          margin: 0 !important;
        }
        .biz-intro-kicker {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          font-family: var(--font-workSans, sans-serif) !important;
          font-size: 0.6875rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.2em !important;
          text-transform: uppercase !important;
          color: #C5A880 !important;
          margin-bottom: 0.25rem !important;
        }

        #BusinessSpacesOptions {
          background-color: #10150F !important;
          padding-top: 2rem !important;
          padding-bottom: 3.5rem !important;
        }
        #BusinessSpacesOptions .retail-spaces-reveal-image {
          clip-path: none !important;
          height: 240px !important;
          margin: 0 1.25rem 2rem 1.25rem !important;
          width: calc(100% - 2.5rem) !important;
          border-radius: 1.25rem !important;
          overflow: hidden !important;
          border: 1px solid rgba(197, 168, 128, 0.25) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
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
    if (h2 && p) {
      let kicker = sec.querySelector('.biz-intro-kicker');
      if (!kicker) {
        kicker = document.createElement('div');
        kicker.className = 'biz-intro-kicker';
        kicker.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#C5A880;display:inline-block;"></span> COMMERCIAL & PRESTIGE';
        h2.parentNode.insertBefore(kicker, h2);
      }
      if (!p.closest('.biz-intro-card-mobile')) {
        const card = document.createElement('div');
        card.className = 'biz-intro-card-mobile';
        p.parentNode.insertBefore(card, p);
        card.appendChild(p);

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(197,168,128,0.2);font-size:0.6875rem;letter-spacing:0.12em;text-transform:uppercase;color:#C5A880;font-weight:600;';
        row.innerHTML = '<span>SURFACES MODULABLES</span><span>PRESTIGE MENARA</span>';
        card.appendChild(row);
      }
    }
  });

  await page.waitForTimeout(400);

  const top = await page.evaluate(() => {
    const el = document.getElementById('BusinessSpaces');
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

  for (let i = 0; i < 4; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), top + i * 250);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/biz_trans_${i}.png`
    });
  }

  await browser.close();
}

testTransition();

