import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  
  const videoDurations = await page.evaluate(async () => {
    function getDur(src) {
      return new Promise(resolve => {
        const v = document.createElement('video');
        v.src = src;
        v.onloadedmetadata = () => resolve(v.duration);
        v.onerror = () => resolve(null);
      });
    }
    const dDesktop = await getDur('/home/hero.mp4');
    const dMobile = await getDur('/home/hero-m.webm');
    return { dDesktop, dMobile };
  });
  console.log('Video durations:', videoDurations);
  await browser.close();
}

main().catch(console.error);

