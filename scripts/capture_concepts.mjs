import { chromium, devices } from 'playwright-core';

async function captureConcepts() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/business_mobile_concepts.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Capture Concept 1
  const c1 = await page.$('#concept1');
  if (c1) {
    await c1.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/concept_1_editorial.png'
    });
  }

  // Capture Concept 2
  const c2 = await page.$('#concept2');
  if (c2) {
    await c2.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/concept_2_haute_couture.png'
    });
  }

  // Capture Concept 3
  const c3 = await page.$('#concept3');
  if (c3) {
    await c3.screenshot({
      path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/concept_3_sculptural.png'
    });
  }

  console.log('Concepts captured successfully!');
  await browser.close();
}

captureConcepts();

