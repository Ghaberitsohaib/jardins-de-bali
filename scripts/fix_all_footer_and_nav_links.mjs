import fs from 'fs';

const pages = [
  'index.html',
  'business.html',
  'retail-spaces.html',
  'residences.html',
  'about-the-investor.html',
  'contact.html',
  'ventes.html',
  'maquette3d.html'
];

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Generic link text replacements
  content = content.replace(/(<a[^>]*href=["'](?:\/index\.html|#top)["'][^>]*>)\s*Home\s*(<\/a>)/gi, '$1Accueil$2');
  content = content.replace(/(<a[^>]*href=["'](?:\/maquette3d\.html|#Introduction)["'][^>]*>)\s*3D\s*Experience\s*(<\/a>)/gi, '$1Expérience 3D$2');
  content = content.replace(/(<a[^>]*href=["']\/residences\.html["'][^>]*>)\s*Residences\s*(<\/a>)/gi, '$1Résidences$2');
  content = content.replace(/(<a[^>]*href=["'](?:\/business\.html|#BusinessSpaces)["'][^>]*>)\s*Business\s*(<\/a>)/gi, '$1Espaces d\'affaires$2');
  content = content.replace(/(<a[^>]*href=["']\/retail-spaces\.html["'][^>]*>)\s*Retail\s*Spaces\s*(<\/a>)/gi, '$1Commerces$2');
  content = content.replace(/(<a[^>]*href=["']\/about-the-investor\.html["'][^>]*>)\s*About\s*the\s*investor\s*(<\/a>)/gi, '$1L\'Investisseur$2');

  // Also in index.html line 736: <p class="biz-item-text">Retail</p>
  content = content.replace(/<p class="biz-item-text">Retail<\/p>/g, '<p class="biz-item-text">Magasins Flagship</p>');

  // Also in index.html line 1318
  content = content.replace(/Share your inquiry and our advisors will contact you shortly\./g, 'Transmettez votre demande et nos conseillers vous contacteront dans les plus brefs délais.');

  // In retail-spaces.html
  content = content.replace(/RETAIL &amp; BUSINESS SPACES/g, 'COMMERCES &amp; ESPACES D\'AFFAIRES');
  content = content.replace(/RETAIL & BUSINESS SPACES/g, 'COMMERCES & ESPACES D\'AFFAIRES');
  content = content.replace(/Retail \/ Magasins/g, 'Magasins Flagship');

  // About the investor nav in about-the-investor.html
  content = content.replace(/<span class="arbor-nav-primary">About the investor<\/span>/g, '<span class="arbor-nav-primary">L\'Investisseur</span>');
  content = content.replace(/<span class="arbor-nav-accent">About the investor<\/span>/g, '<span class="arbor-nav-accent">L\'Investisseur</span>');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned up ${file}`);
});
