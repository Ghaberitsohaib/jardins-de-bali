import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const queries = ['business.mp4', 'interior.mp4', 'amenities.mp4'];
for (const q of queries) {
  let idx = html.indexOf(q);
  if (idx !== -1) {
    console.log(`Found ${q} at ${idx}:`);
    console.log(html.substring(Math.max(0, idx - 200), idx + 200));
  }
}

