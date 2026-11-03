import fs from 'fs';

const html = fs.readFileSync('scripts/belgrade_roots_mobile.html', 'utf8');

// Find all roots-image containers
const parts = html.split('<div class="roots-image');
parts.slice(1).forEach((p, idx) => {
  console.log(`\n================ IMAGE ${idx + 1} ================`);
  console.log(p.slice(0, 700));
});

