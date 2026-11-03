import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public', 'audit');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const targets = [
  { name: 'home_desktop.png', url: 'http://localhost:5173/', width: 1920, height: 1080 },
  { name: 'home_mobile.png', url: 'http://localhost:5173/', width: 390, height: 844 },
  { name: 'residences_desktop.png', url: 'http://localhost:5173/ventes.html', width: 1920, height: 1080 },
  { name: 'residences_mobile.png', url: 'http://localhost:5173/ventes.html', width: 390, height: 844 },
  { name: 'retail_desktop.png', url: 'http://localhost:5173/retail-spaces.html', width: 1920, height: 1080 },
  { name: 'retail_mobile.png', url: 'http://localhost:5173/retail-spaces.html', width: 390, height: 844 },
  { name: 'business_desktop.png', url: 'http://localhost:5173/business.html', width: 1920, height: 1080 },
  { name: 'maquette_desktop.png', url: 'http://localhost:5173/maquette3d.html', width: 1920, height: 1080 },
];

async function captureAll() {
  console.log(`Starting audit screenshots capture into ${OUTPUT_DIR}...`);
  for (const t of targets) {
    const outPath = path.join(OUTPUT_DIR, t.name);
    const args = [
      '--headless=new',
      `--screenshot=${outPath}`,
      `--window-size=${t.width},${t.height}`,
      '--hide-scrollbars',
      '--disable-gpu',
      '--virtual-time-budget=2000',
      t.url
    ];
    try {
      await execFileAsync(CHROME_PATH, args);
      console.log(`✓ Captured ${t.name} (${t.width}x${t.height})`);
    } catch (err) {
      console.error(`✗ Error capturing ${t.name}:`, err.message);
    }
  }
  console.log('All screenshots captured successfully.');
}

captureAll();

