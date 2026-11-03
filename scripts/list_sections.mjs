import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const sections = [...html.matchAll(/<section([^>]*)>/g)].map(m => m[1]);
console.log('Total sections:', sections.length);
sections.forEach((s, i) => console.log(`${i}: ${s}`));

