import fs from 'fs';

const html = fs.readFileSync('scripts/belgrade_menu_full.html', 'utf8');
const clean = html.replace(/d="[^"]+"/g, 'd="..."');
console.log(clean.slice(0, 3500));
console.log('--- BOTTOM OF MENU ---');
console.log(clean.slice(-3000));

