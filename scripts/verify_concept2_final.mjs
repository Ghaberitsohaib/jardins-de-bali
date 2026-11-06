import { chromium, devices } from 'playwright-core';
import fs from 'fs';

async function verifyFinal() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const errors = [];

  // 1. Mobile verification (iPhone 14 Pro)
  const mobileContext = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[Mobile Console Error] ${msg.text()}`);
  });

  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Scroll to #BusinessSpaces
  const bizHero = mobilePage.locator('#BusinessSpaces');
  await bizHero.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(800);

  const heroBox = await bizHero.boundingBox();
  await mobilePage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/final_c2_hero_mobile.png',
    clip: {
      x: 0,
      y: heroBox.y,
      width: 393,
      height: 852
    }
  });

  // Scroll down slightly to #BusinessSpacesOptions
  const bizOptions = mobilePage.locator('#BusinessSpacesOptions');
  await bizOptions.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(800);

  const optBox = await bizOptions.boundingBox();
  await mobilePage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/final_c2_options_mobile.png',
    clip: {
      x: 0,
      y: optBox.y,
      width: 393,
      height: Math.min(optBox.height, 900)
    }
  });

  // 2. Desktop verification (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[Desktop Console Error] ${msg.text()}`);
  });

  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  const bizHeroDesktop = desktopPage.locator('#BusinessSpaces');
  await bizHeroDesktop.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(800);

  const heroDeskBox = await bizHeroDesktop.boundingBox();
  await desktopPage.screenshot({
    path: 'C:/Users/ghabr/.gemini/antigravity/brain/db659566-e772-44f8-93f0-e36abdb74f1a/final_c2_hero_desktop.png',
    clip: {
      x: 0,
      y: heroDeskBox.y,
      width: 1440,
      height: 900
    }
  });

  await browser.close();

  console.log('Verification finished.');
  console.log('Errors logged:', errors);
}

verifyFinal().catch(err => {
  console.error(err);
  process.exit(1);
});
