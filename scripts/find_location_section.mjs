import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const queries = ["What's around", "what's around", "Location", "Around"];
for (const q of queries) {
  let idx = html.indexOf(q);
  if (idx !== -1) {
    console.log(`Found "${q}" at ${idx}:`);
    console.log(html.substring(Math.max(0, idx - 150), idx + 250));
  }
}

