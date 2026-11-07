import fs from 'fs';

let content = fs.readFileSync('business.html', 'utf8');

// 1. Inquire in header
content = content.replace(
  /<span class="arbor-inquire-row arbor-inquire-row-1">\s*<span>Inquire<\/span>/g,
  '<span class="arbor-inquire-row arbor-inquire-row-1">\n                <span>Contact</span>'
);
content = content.replace(
  /<span class="arbor-inquire-row arbor-inquire-row-2">\s*<span>Inquire<\/span>/g,
  '<span class="arbor-inquire-row arbor-inquire-row-2">\n                <span>Contact</span>'
);

// 2. Mobile menu links
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

// 3. Mobile menu pill button INQUIRE
content = content.replace(
  /<span class="arbor-mobile-inquire-text">INQUIRE<\/span>/g,
  '<span class="arbor-mobile-inquire-text">CONTACT</span>'
);

// 4. Detail options panels
content = content.replace(
  /<p class="biz-panel-title">4 <span>flagship retail units \(554 m²\)<\/span><\/p>\s*<p class="biz-panel-desc">Positioned directly on Boulevard M-16 with 4\.80m double-height ceilings,\s*wide glazed shopfronts, and maximum commercial visibility\. Magasin 1 \(56 m²\), Magasin 2 \(221 m²\),\s*Magasin 3 \(56 m²\), Magasin 4 \(221 m²\)\.<\/p>/,
  `<p class="biz-panel-title">4 <span>magasins flagships (554 m²)</span></p>
                    <p class="biz-panel-desc">Positionnés directement sur le Boulevard M-16 avec une double hauteur sous plafond de 4,80 m, de larges vitrines panoramiques et une visibilité commerciale maximale. Magasin 1 (56 m²), Magasin 2 (221 m²), Magasin 3 (56 m²), Magasin 4 (221 m²).</p>`
);

content = content.replace(
  /<p class="biz-panel-title">8 <span>commercial mezzanines<\/span><\/p>\s*<p class="biz-panel-desc">Elevated premium display and retail zones designed for flagship boutiques,\s*art galleries, high-end interior designers, and exclusive showroom concepts with private terrace\s*access\.<\/p>/,
  `<p class="biz-panel-title">8 <span>mezzanines commerciales</span></p>
                    <p class="biz-panel-desc">Espaces d'exposition et de vente en hauteur pensés pour les boutiques de prestige, galeries d'art, créateurs d'intérieur haut de gamme et concepts de showrooms exclusifs avec terrasse privée.</p>`
);

content = content.replace(
  /<p class="biz-panel-title">12 <span>executive office suites<\/span><\/p>\s*<p class="biz-panel-desc">Flexible modular corporate office floors ranging from 45 m² to 420 m²,\s*designed for law firms, medical clinics, financial consultancies, and private wealth family\s*offices\.<\/p>/,
  `<p class="biz-panel-title">12 <span>plateaux de bureaux de prestige</span></p>
                    <p class="biz-panel-desc">Plateaux de bureaux d'affaires modulables et flexibles de 45 m² à 420 m², conçus pour les cabinets juridiques, cliniques médicales, cabinets d'expertise financière et family offices.</p>`
);

content = content.replace(
  /<p class="biz-panel-title">50\+ <span>secure parking spaces<\/span><\/p>\s*<p class="biz-panel-desc">Two full underground parking levels with license plate recognition,\s*automatic barriers, wide driveways, EV charging stations, and dedicated freight delivery bays for\s*retail operators\.<\/p>/,
  `<p class="biz-panel-title">50+ <span>places de parking sécurisées</span></p>
                    <p class="biz-panel-desc">Deux niveaux complets de stationnement sous-terrain sécurisé avec reconnaissance de plaques, barrières automatiques, bornes de recharge pour véhicules électriques et quais dédiés aux livraisons.</p>`
);

// 5. Inquire button in options section
content = content.replace(
  /<a href="https:\/\/wa\.me\/212665644391\?text=Bonjour[^"]+"[^>]*class="biz-btn-inquire">\s*<span>INQUIRE<\/span>/,
  `<a href="https://wa.me/212665644391?text=Bonjour%20BaytImmo%2C%20je%20souhaite%20des%20informations%20sur%20les%20espaces%20commerciaux%20Jardins%20de%20Bali"
                    target="_blank" rel="noopener" class="biz-btn-inquire">
                    <span>S'INFORMER</span>`
);

// 6. Panorama section
content = content.replace(
  /<h2 class="panorama-title w-full flex-1 mb-8 max-md:mb-5">Favorite Rituals and Culinary Experiences with\s*Panoramic View<\/h2>/,
  '<h2 class="panorama-title w-full flex-1 mb-8 max-md:mb-5">Rituels Privilégiés et Expériences Culinaires avec Vue Panoramique</h2>'
);

content = content.replace(
  /Jardins de Bali features top-notch amenities within the complex, including a café restaurant on the\s*top recessed floor, as well as close proximity to other business and commercial areas\.<br \/><br \/>\s*All of this contributes to creating a complete business ecosystem, where work, meetings, and all\s*operational processes take place in one convenient location\.<br \/><br \/>\s*The space's authenticity and charm are elevated by an open panoramic view of the Atlas Mountains and\s*Marrakech, creating an ideal setting for informal meetings, networking, and engaging conversations\s*in a pleasant and inspiring atmosphere\./,
  `Les Jardins de Bali offrent des prestations d'exception au sein du complexe, notamment un café restaurant en attique avec terrasse panoramique, ainsi qu'une proximité immédiate avec les pôles d'affaires et commerciaux majeurs.<br /><br />
                    Cet ensemble crée un véritable écosystème d'affaires complet, où réunions, synergies professionnelles et activités opérationnelles se déroulent en un lieu unique et privilégié.<br /><br />
                    L'authenticité et le raffinement des lieux sont sublimés par une vue panoramique imprenable sur les montagnes de l'Atlas et Marrakech, offrant un cadre idéal pour des déjeuners d'affaires, des rencontres de réseau et des échanges inspirants dans une atmosphère sereine et prestigieuse.`
);

content = content.replace(
  /<span>Explore spaces<\/span>/g,
  '<span>Explorer les espaces</span>'
);

// 7. Footer newsletter heading
content = content.replace(
  /JOIN THE WORLD OF JARDINS DE BALI/g,
  'REJOIGNEZ L\'UNIVERS DES JARDINS DE BALI'
);

// 8. Footer nav links
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
  /<a\s+class="hover:text-green paragraph font-normal uppercase transition"\s+href="\/about-the-investor\.html">About the investor<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="/about-the-investor.html">L\'Investisseur</a>'
);

// 9. All Rights Reserved
content = content.replace(
  /All Rights Reserved\./g,
  'Tous droits réservés.'
);

fs.writeFileSync('business.html', content, 'utf8');
console.log('business.html updated successfully.');

