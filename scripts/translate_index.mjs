import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// 1. Header & Mobile Menu Inquire / Nav
content = content.replace(
  /<span class="arbor-inquire-row arbor-inquire-row-1">\s*<span>Inquire<\/span>/g,
  '<span class="arbor-inquire-row arbor-inquire-row-1">\n                <span>Contact</span>'
);
content = content.replace(
  /<span class="arbor-inquire-row arbor-inquire-row-2">\s*<span>Inquire<\/span>/g,
  '<span class="arbor-inquire-row arbor-inquire-row-2">\n                <span>Contact</span>'
);
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
content = content.replace(
  /<span class="arbor-mobile-inquire-text">INQUIRE<\/span>/g,
  '<span class="arbor-mobile-inquire-text">CONTACT</span>'
);

// 2. Explore in 3d buttons
content = content.replace(/>\s*Explore in 3d\s*</g, '>Explorer en 3D<');

// 3. Canopy / Skyline text
content = content.replace(
  /The visual identity of BaytImmo is defined by an elegant facade inspired by the form of a tree canopy, a symbol of growth, balance, and longevity\./g,
  "L'identité visuelle de BaytImmo se distingue par une façade élégante inspirée de la canopée arborée, symbole d'élévation, d'équilibre et de pérennité."
);

content = content.replace(
  /BaytImmo isn't just another addition to the skyline; it's a curated urban ecosystem that evolves with the rhythm of the city\./g,
  "BaytImmo ne se contente pas d'enrichir le paysage urbain ; c'est un écosystème raffiné pensé pour évoluer au rythme de la ville."
);

content = content.replace(
  /A New Chapter in Prestigious Living/g,
  "Un Nouveau Chapitre de l'Art de Vivre"
);

content = content.replace(
  /A clear architectural vision, a carefully selected location, and thoughtfully curated amenities make BaytImmo a residential destination where quality, comfort, and long-term value naturally converge\./g,
  "Une vision architecturale affirmée, un emplacement d'exception et des prestations haut de gamme font de BaytImmo une adresse de prestige où se conjuguent qualité, confort et valeur patrimoniale."
);

content = content.replace(
  />Explore Our Apartments</g,
  ">Explorer nos appartements<"
);

// 4. Apartments overview text
content = content.replace(
  /Designed with contemporary living in mind, each apartment at BaytImmo balances functionality, comfort, and aesthetics\. Open-plan layouts, excellent natural light, refined materials, and carefully considered details create spaces that feel both welcoming and enduring\./g,
  "Pensé pour un art de vivre contemporain, chaque appartement de BaytImmo allie fonctionnalité, confort et élégance esthétique. Des agencements fluides, une lumière naturelle généreuse, des matériaux nobles et des détails soignés créent des espaces chaleureux et intemporels."
);

content = content.replace(/>View all</g, ">Voir tout<");
content = content.replace(/units available/g, "disponibles");

// 5. Business & Retails
content = content.replace(/Office spaces and retails/g, "Bureaux & Espaces Commerciaux");
content = content.replace(
  /More than an address — a statement of vision &amp; prestige\./g,
  "Plus qu'une adresse — une signature de vision et de prestige."
);
content = content.replace(
  /Business spaces and retail units at BaytImmo are designed for companies of all sizes that see their business address as more than just a location—it is a reflection of their identity, reputation, and long-term vision\./g,
  "Les espaces de bureaux et magasins de BaytImmo sont conçus pour les entreprises d'envergure qui considèrent leur adresse comme l'expression même de leur identité, de leur réputation et de leur vision d'avenir."
);
content = content.replace(
  /<p class="text-cream heading-1 absolute bottom-20 left-20 z-3 w-2\/3 uppercase max-xl:hidden" data-anim="heading">Business spaces<\/p>/g,
  '<p class="text-cream heading-1 absolute bottom-20 left-20 z-3 w-2/3 uppercase max-xl:hidden" data-anim="heading">Espaces d\'affaires</p>'
);

// Options panel in index.html
content = content.replace(
  /<p class="biz-panel-title">11 <span>retail and hospitality units<\/span><\/p>\s*<p class="biz-panel-desc">Adaptable to various types of businesses, with an optimal layout and natural lighting that fosters a productive work atmosphere\.<\/p>/,
  `<p class="biz-panel-title">4 <span>magasins flagships (554 m²)</span></p>
                    <p class="biz-panel-desc">Positionnés sur le boulevard avec 4,80 m de hauteur sous plafond et de larges vitrines panoramiques assurant une visibilité commerciale maximale.</p>`
);

content = content.replace(
  /<p class="biz-panel-title">11 <span>retail and hospitality units<\/span><\/p>\s*<p class="biz-panel-desc">Comfortable and functional, suitable for offices, coworking, or showrooms, with easy access and a professional environment\.<\/p>/,
  `<p class="biz-panel-title">8 <span>mezzanines commerciales</span></p>
                    <p class="biz-panel-desc">Espaces d'exposition et de vente en hauteur pensés pour les boutiques de prestige, galeries d'art, designers d'intérieur et showrooms exclusifs.</p>`
);

content = content.replace(
  /<p class="biz-panel-title">9 <span>retail and hospitality units<\/span><\/p>\s*<p class="biz-panel-desc">Located along an impressive, representative entrance with a glass curtain wall\. This business wing contains no residential units, offering business tenants an added level of privacy and a professional setting\.<\/p>/,
  `<p class="biz-panel-title">12 <span>plateaux de bureaux de prestige</span></p>
                    <p class="biz-panel-desc">Plateaux modulables de 45 m² à 420 m² avec accès indépendant, pensés pour les cabinets juridiques, cliniques médicales, cabinets financiers et family offices.</p>`
);

content = content.replace(
  /<p class="biz-panel-title">18 <span>retail and hospitality units<\/span><\/p>\s*<p class="biz-panel-desc">BaytImmo complex features 18 retail and hospitality units distributed evenly across Wing A and Wing B\. All premises are situated on the ground floor at the building's front, ensuring maximum visibility and direct street access\.<\/p>/,
  `<p class="biz-panel-title">50+ <span>places de parking sécurisées</span></p>
                    <p class="biz-panel-desc">Deux niveaux complets de stationnement sous-terrain sécurisé avec reconnaissance automatique des plaques, bornes de recharge et quais de déchargement dédiés.</p>`
);

content = content.replace(/>Find out more</g, ">En savoir plus<");

// 6. The way of living / roots
content = content.replace(/The way of living/g, "L'art de vivre");
content = content.replace(/Your roots/g, "Vos racines");
content = content.replace(
  /In BaytImmo, each residence is crafted not merely for living, but as a space that evolves alongside you/g,
  "Chez BaytImmo, chaque résidence est conçue non seulement pour y vivre, mais comme un lieu qui grandit et évolue à vos côtés"
);
content = content.replace(/>\s*Explore residences\s*</g, ">Explorer les résidences<");

// 7. Amenities
content = content.replace(/>Amenities</g, ">Prestations d'Exception<");
content = content.replace(
  /BaytImmo is more than a residence\. It features two private fitness spaces, two exclusive rooftop swimming pools and parks for residents and their guests, and three levels of secure parking\. Curated spaces for wellness and serenity—a true sanctuary right at your doorstep\./g,
  "BaytImmo est bien plus qu'une simple résidence. Le domaine offre deux espaces fitness privés, deux piscines en rooftop avec jardins suspendus pour les résidents, et trois niveaux de parking sécurisé. Un véritable sanctuaire de bien-être et de sérénité au quotidien."
);

content = content.replace(
  /A place designed for an active and balanced lifestyle\. A modernly equipped space that allows you to stay dedicated to yourself and your routines, with the comfort provided by life within the BaytImmo complex\./g,
  "Un espace dédié à un mode de vie actif et équilibré. Équipé d'appareils de dernière génération, il vous permet de préserver vos rituels de bien-être au sein du complexe."
);

content = content.replace(
  /Your personal space for movement and balance\. Designed in line with modern living, the in-house gym lets you stay focused on yourself, without leaving the complex and without distractions\./g,
  "Votre espace personnel de mouvement et d'harmonie. Conçue pour les exigences modernes, la salle de sport privée vous permet de vous ressourcer en toute tranquillité."
);

content = content.replace(
  /Coming home begins without searching for a space\. Spread across three underground levels, the garage offers security, privacy and everyday comfort, with your vehicle always within reach, protected and available at any moment, without leaving the complex\./g,
  "Le confort débute dès votre arrivée. Réparti sur trois niveaux en sous-sol, le garage privé garantit sécurité, discrétion et praticité, avec votre véhicule toujours protégé et directement accessible."
);

content = content.replace(/A view from above/g, "Une vue imprenable");

// 8. Installment plan
content = content.replace(/Installment plan/g, "Échéancier de paiement");
content = content.replace(/>Pre-contract</g, ">À la réservation<");
content = content.replace(/>Zero level</g, ">Achèvement des fondations<");
content = content.replace(/>Structure completed</g, ">Gros œuvre achevé<");
content = content.replace(/>Building 80% complete</g, ">Second œuvre (80%)<");
content = content.replace(/>Technical acceptance</g, ">Livraison & Remise des clés<");
content = content.replace(/Building permit/g, "Permis de construire");

// 9. Footer
content = content.replace(/JOIN THE WORLD OF BAYTIMMO/g, "REJOIGNEZ L'UNIVERS BAYTIMMO");
content = content.replace(
  /Subscribe to join our community and stay up to date\./g,
  "Abonnez-vous pour recevoir en avant-première nos actualités et disponibilités."
);
content = content.replace(/First name\*/g, "Prénom*");
content = content.replace(/Last name\*/g, "Nom*");
content = content.replace(
  /I consent to my information being collected in accordance with the BaytImmo Privacy policy/g,
  "J'accepte que mes données soient traitées conformément à la Politique de confidentialité de BaytImmo"
);

content = content.replace(
  /Disclaimer: Upon completion of the project's materialization, minor deviations in the appearance of the facade or architectural details may occur compared to the presented renderings\./g,
  "Mentions légales : Lors de la réalisation du projet, de légères adaptations de façades ou de finitions peuvent survenir par rapport aux modélisations et rendus 3D présentés."
);
content = content.replace(
  /For direct inquiries, our team is available at/g,
  "Pour toute demande directe, notre équipe est à votre disposition au"
);

content = content.replace(
  /© 2026\. All Rights Reserved\./g,
  "© 2026 BaytImmo. Tous droits réservés."
);

// Footer links
content = content.replace(
  /<a class="hover:text-green paragraph font-normal uppercase transition" href="#top" data-scroll-to="top">Home<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="#top" data-scroll-to="top">Accueil</a>'
);
content = content.replace(
  /<a class="hover:text-green paragraph font-normal uppercase transition" href="#Introduction" data-scroll-to="Introduction">3D Experience<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="#Introduction" data-scroll-to="Introduction">Expérience 3D</a>'
);
content = content.replace(
  /<a class="hover:text-green paragraph font-normal uppercase transition" href="\/residences\.html">Residences<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="/residences.html">Résidences</a>'
);
content = content.replace(
  /<a class="hover:text-green paragraph font-normal uppercase transition" href="#BusinessSpaces" data-scroll-to="BusinessSpaces">Business<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="#BusinessSpaces" data-scroll-to="BusinessSpaces">Espaces d\'affaires</a>'
);
content = content.replace(
  /<a class="hover:text-green paragraph font-normal uppercase transition" href="\/retail-spaces\.html">Retail Spaces<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="/retail-spaces.html">Commerces</a>'
);
content = content.replace(
  /<a class="hover:text-green paragraph font-normal uppercase transition" href="\/about-the-investor\.html">About the investor<\/a>/g,
  '<a class="hover:text-green paragraph font-normal uppercase transition" href="/about-the-investor.html">L\'Investisseur</a>'
);

// 10. Modal
content = content.replace(
  /<h3 class="contact-modal-title">Inquire — BaytImmo<\/h3>/g,
  '<h3 class="contact-modal-title">Contact — BaytImmo</h3>'
);
content = content.replace(
  /Share your inquiry and our property advisors will get in touch shortly\./g,
  "Transmettez votre demande et nos conseillers immobiliers vous répondront dans les plus brefs délais."
);
content = content.replace(/<span>Inquire<\/span>/g, "<span>Envoyer la demande</span>");
content = content.replace(
  /Thank you! Your inquiry has been sent\./g,
  "Merci ! Votre demande a été envoyée avec succès."
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('index.html updated successfully.');

