import fs from 'fs';

// 1. retail-spaces.html
if (fs.existsSync('retail-spaces.html')) {
  let c = fs.readFileSync('retail-spaces.html', 'utf8');
  c = c.replace(/<span class="arbor-nav-primary text-golden">Retail Spaces<\/span>/g, '<span class="arbor-nav-primary text-golden">Commerces</span>');
  c = c.replace(/<span class="arbor-nav-accent text-golden">Retail Spaces<\/span>/g, '<span class="arbor-nav-accent text-golden">Commerces</span>');
  c = c.replace(/RETAIL &amp; BUSINESS<br class="hidden sm:inline" \/> SPACES/g, 'COMMERCES &amp;<br class="hidden sm:inline" /> ESPACES D\'AFFAIRES');
  c = c.replace(/RETAIL & BUSINESS<br class="hidden sm:inline" \/> SPACES/g, 'COMMERCES &<br class="hidden sm:inline" /> ESPACES D\'AFFAIRES');
  fs.writeFileSync('retail-spaces.html', c, 'utf8');
  console.log('retail-spaces.html finalized.');
}

// 2. about-the-investor.html
if (fs.existsSync('about-the-investor.html')) {
  let c = fs.readFileSync('about-the-investor.html', 'utf8');
  c = c.replace(/About the investor<\/span>/g, "L'Investisseur</span>");
  fs.writeFileSync('about-the-investor.html', c, 'utf8');
  console.log('about-the-investor.html finalized.');
}

// 3. business.html
if (fs.existsSync('business.html')) {
  let c = fs.readFileSync('business.html', 'utf8');
  c = c.replace(/BUSINESS<br class="hidden sm:inline" \/> SPACES/g, 'ESPACES<br class="hidden sm:inline" /> D\'AFFAIRES');
  c = c.replace(/<span>Explorer les Espaces Business<\/span>/g, '<span>Explorer les Espaces d\'Affaires</span>');
  c = c.replace(/alt="Business Spaces Jardins de Bali Marrakech"/g, 'alt="Espaces d\'Affaires Jardins de Bali Marrakech"');
  fs.writeFileSync('business.html', c, 'utf8');
  console.log('business.html finalized.');
}

