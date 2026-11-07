import fs from 'fs';

const pages = [
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

  // Header Inquire
  content = content.replace(
    /<span class="arbor-inquire-row arbor-inquire-row-1">\s*<span>Inquire<\/span>/g,
    '<span class="arbor-inquire-row arbor-inquire-row-1">\n                <span>Contact</span>'
  );
  content = content.replace(
    /<span class="arbor-inquire-row arbor-inquire-row-2">\s*<span>Inquire<\/span>/g,
    '<span class="arbor-inquire-row arbor-inquire-row-2">\n                <span>Contact</span>'
  );

  // Mobile menu links
  content = content.replace(
    /<span class="arbor-nav-primary">Home<\/span>\s*<span class="arbor-nav-accent">Home<\/span>/g,
    '<span class="arbor-nav-primary">Accueil</span>\n              <span class="arbor-nav-accent">Accueil</span>'
  );
  content = content.replace(
    /<span class="arbor-nav-primary">3D Experience<\/span>\s*<span class="arbor-nav-accent">3D Experience<\/span>/g,
    '<span class="arbor-nav-primary">Expérience 3D</span>\n              <span class="arbor-nav-accent">Expérience 3D</span>'
  );
  content = content.replace(
    /<span class="arbor-nav-primary">Residences<\/span>\s*<span class="arbor-nav-accent">Residences<\/span>/g,
    '<span class="arbor-nav-primary">Résidences</span>\n              <span class="arbor-nav-accent">Résidences</span>'
  );
  content = content.replace(
    /<span class="arbor-nav-primary">Business<\/span>\s*<span class="arbor-nav-accent">Business<\/span>/g,
    '<span class="arbor-nav-primary">Espaces d\'affaires</span>\n              <span class="arbor-nav-accent">Espaces d\'affaires</span>'
  );
  content = content.replace(
    /<span class="arbor-nav-primary">Retail Spaces<\/span>\s*<span class="arbor-nav-accent">Retail Spaces<\/span>/g,
    '<span class="arbor-nav-primary">Commerces</span>\n              <span class="arbor-nav-accent">Commerces</span>'
  );
  content = content.replace(
    /<span class="arbor-nav-primary">About the investor<\/span>\s*<span class="arbor-nav-accent">About the investor<\/span>/g,
    '<span class="arbor-nav-primary">L\'Investisseur</span>\n              <span class="arbor-nav-accent">L\'Investisseur</span>'
  );

  // Mobile menu bottom pill button
  content = content.replace(
    /<span class="arbor-mobile-inquire-text">INQUIRE<\/span>/g,
    '<span class="arbor-mobile-inquire-text">CONTACT</span>'
  );

  // Footer nav links
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/index\.html">Home<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition" href="/index.html">Accueil</a>'
  );
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/maquette3d\.html">3D\s*Experience<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition" href="/maquette3d.html">Expérience 3D</a>'
  );
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/residences\.html">Residences<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition" href="/residences.html">Résidences</a>'
  );
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/business\.html">Business<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition" href="/business.html">Espaces d\'affaires</a>'
  );
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition text-golden"\s+href="\/retail-spaces\.html">Retail Spaces<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition text-golden" href="/retail-spaces.html">Commerces</a>'
  );
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/retail-spaces\.html">Retail Spaces<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition" href="/retail-spaces.html">Commerces</a>'
  );
  content = content.replace(
    /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/about-the-investor\.html">About the investor<\/a>/g,
    '<a class="hover:text-green paragraph font-normal uppercase transition" href="/about-the-investor.html">L\'Investisseur</a>'
  );

  // Footer copyright
  content = content.replace(/All Rights Reserved\./g, 'Tous droits réservés.');
  content = content.replace(/JOIN THE WORLD OF BAYTIMMO/g, 'REJOIGNEZ L\'UNIVERS BAYTIMMO');
  content = content.replace(
    /Subscribe to join our community and stay up to date\./g,
    'Abonnez-vous pour recevoir en avant-première nos actualités et disponibilités.'
  );

  // Specific to retail-spaces.html
  if (file === 'retail-spaces.html') {
    content = content.replace(
      /<title>Retail &amp; Business Spaces \| Jardins de Bali \| BaytImmo<\/title>/g,
      '<title>Commerces &amp; Espaces d\'Affaires | Jardins de Bali | BaytImmo</title>'
    );
    content = content.replace(
      /"name": "Retail & Business Spaces — Jardins de Bali Marrakech"/g,
      '"name": "Commerces & Espaces d\'Affaires — Jardins de Bali Marrakech"'
    );
    content = content.replace(
      /<h1 class="retail-hero-title">[\s\S]*?RETAIL &amp; BUSINESS[\s\S]*?SPACES[\s\S]*?<\/h1>/,
      `<h1 class="retail-hero-title">
            COMMERCES &amp;<br class="hidden sm:inline" /> AFFAIRES
          </h1>`
    );
    content = content.replace(
      /Inquire — Retail &amp; Business Spaces/g,
      'Contact — Commerces &amp; Espaces d\'Affaires'
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`${file} updated.`);
});

