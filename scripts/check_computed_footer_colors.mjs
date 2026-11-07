import { chromium } from 'playwright-core';

async function checkColors() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  // Test business.html
  await page.goto('http://localhost:4173/business.html', { waitUntil: 'networkidle' });
  const bizTitleColor = await page.$eval('#footer .heading-2', el => window.getComputedStyle(el).color);
  const bizDescColor = await page.$eval('#footer .paragraph', el => window.getComputedStyle(el).color);
  const bizNavLink = await page.$eval('#footer ul a', el => window.getComputedStyle(el).color);
  console.log('business.html:');
  console.log('  title color:', bizTitleColor);
  console.log('  paragraph color:', bizDescColor);
  console.log('  nav link color:', bizNavLink);

  // Test retail-spaces.html
  await page.goto('http://localhost:4173/retail-spaces.html', { waitUntil: 'networkidle' });
  const retTitleColor = await page.$eval('#footer .heading-2', el => window.getComputedStyle(el).color);
  const retDescColor = await page.$eval('#footer .small', el => window.getComputedStyle(el).color);
  const retNavLink = await page.$eval('#footer ul a', el => window.getComputedStyle(el).color);
  console.log('retail-spaces.html:');
  console.log('  title color:', retTitleColor);
  console.log('  small color:', retDescColor);
  console.log('  nav link color:', retNavLink);

  await browser.close();
}

checkColors().catch(console.error);
