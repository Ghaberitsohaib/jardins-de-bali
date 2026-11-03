import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('RETAIL & BUSINESS SPACES') || c.includes('Une adresse de prestige')) {
    console.log('Screen 1 is in:', f);
  }
  if (c.includes('STEP INTO NEW SUCCESSES') || (c.includes('BUSINESS SPACES') && f === 'business.html')) {
    console.log('Screen 2 is in:', f);
  }
  if (c.includes('Une nouvelle dimension de l\'art de vivre') || (c.includes('RESIDENCES') && f === 'residences.html')) {
    console.log('Screen 3 is in:', f);
  }
}

