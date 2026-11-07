import fs from 'fs';

const html = fs.readFileSync('contact.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  const t = l.trim();
  if (t.includes('placeholder=') || t.includes('<label') || t.includes('<button') || t.includes('<h1') || t.includes('<h2') || t.includes('<h3')) {
    console.log(`${i+1}: ${t}`);
  }
});

