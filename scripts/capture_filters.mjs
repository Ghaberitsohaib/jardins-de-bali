import { chromium } from 'playwright-core';

async function capture() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  
  // Desktop Viewport (1440x1000)
  const contextDesk = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2
  });
  const pageDesk = await contextDesk.newPage();
  await pageDesk.goto('http://localhost:5173/retail-spaces.html', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(800);

  // Scroll directly to #Picker section
  await pageDesk.evaluate(() => {
    const picker = document.getElementById('Picker');
    if (picker) {
      const top = picker.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - 60);
    }
  });
  await pageDesk.waitForTimeout(800);

  // Screenshot desktop filter area
  await pageDesk.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_filters_clean_desktop.png',
    fullPage: false
  });

  // Also capture element screenshot of just the picker sidebar
  const sidebar = await pageDesk.$('.picker-sidebar');
  if (sidebar) {
    await sidebar.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/verify_sidebar_clean_only.png'
    });
  }

  await browser.close();
  console.log('Capture finished successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
