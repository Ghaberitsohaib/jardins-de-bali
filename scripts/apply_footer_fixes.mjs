import fs from 'fs';

// 1. Update retail-spaces.html
let retail = fs.readFileSync('retail-spaces.html', 'utf8');

// Replace body rule in <style>
retail = retail.replace(
  `    body {\r\n      background-color: #10150F !important;\r\n      color: #FAF7EF !important;\r\n    }`,
  `    body {\r\n      background-color: #FAF7EF;\r\n      color: #2E3A26;\r\n    }`
);
retail = retail.replace(
  `    body {\n      background-color: #10150F !important;\n      color: #FAF7EF !important;\n    }`,
  `    body {\n      background-color: #FAF7EF;\n      color: #2E3A26;\n    }`
);

// Replace footer title and add subtitle
retail = retail.replace(
  `<p class="heading-2 leading-tight font-light uppercase">REJOIGNEZ L'UNIVERS BAYTIMMO</p>`,
  `<p class="heading-2 leading-tight font-light uppercase text-pine-green">REJOIGNEZ L'UNIVERS DES JARDINS DE BALI</p>\n          <p class="paragraph mt-6 text-pine-green">Abonnez-vous pour recevoir les disponibilités exclusives des espaces commerciaux & d'affaires.</p>`
);

// Replace email label
retail = retail.replace(
  `<label class="small mb-2 block text-golden uppercase" for="footer-email">Email*</label>`,
  `<label class="small mb-2 block text-golden uppercase" for="footer-email">Email professionnel*</label>`
);

// Replace consent label
retail = retail.replace(
  `J'accepte que mes coordonnées soient traitées conformément à la politique de confidentialité BaytImmo`,
  `J'accepte que mes données soient traitées par Baytimmo dans le cadre de ma demande.`
);

// Add L'Investisseur to retail footer nav
retail = retail.replace(
  `<li class="fadeElement max-md:text-center"><a class="hover:text-green paragraph font-normal uppercase transition" href="/contact.html">Contact</a></li>`,
  `<li class="fadeElement max-md:text-center"><a class="hover:text-green paragraph font-normal uppercase transition" href="/contact.html">Contact</a></li>\n            <li class="fadeElement max-md:text-center"><a class="hover:text-green paragraph font-normal uppercase transition" href="/about-the-investor.html">L'Investisseur</a></li>`
);

// Replace project details & contact info in retail footer
retail = retail.replace(
  `<p class="small">\r\n            Projet Jardins de Bali Marrakech Menara : Titre Foncier 34 603 / M. Ensemble immobilier d'exception en R+5 intégrant 4 magasins flagships (554 m²), plateaux de bureaux, 230 résidences et 234 places de stationnement en sous-sol.\r\n          </p>`,
  `<p class="small text-pine-green">\r\n            Projet Jardins de Bali Marrakech Menara : Titre Foncier 34 603 / M. Architecte : Cabinet AMA Architecture (Guéliz, Marrakech). Complexe immobilier d'exception alliant 230 résidences de prestige, 4 magasins flagship, plateaux de bureaux et galeries commerciales.\r\n          </p>`
);
retail = retail.replace(
  `<p class="small">\n            Projet Jardins de Bali Marrakech Menara : Titre Foncier 34 603 / M. Ensemble immobilier d'exception en R+5 intégrant 4 magasins flagships (554 m²), plateaux de bureaux, 230 résidences et 234 places de stationnement en sous-sol.\n          </p>`,
  `<p class="small text-pine-green">\n            Projet Jardins de Bali Marrakech Menara : Titre Foncier 34 603 / M. Architecte : Cabinet AMA Architecture (Guéliz, Marrakech). Complexe immobilier d'exception alliant 230 résidences de prestige, 4 magasins flagship, plateaux de bureaux et galeries commerciales.\n          </p>`
);

// Replace contact block
const oldContactBlockRegex = /<div class="mt-6 flex flex-col max-sm:w-2\/3">[\s\S]*?Boulevard M-16, Menara Marrakech, Maroc<\/p>\s*<\/div>/;
const newContactBlock = `<div class="mt-6 flex flex-col max-sm:w-2/3">
            <span class="small font-medium tracking-wide uppercase text-golden">Service Commercial Baytimmo :</span>
            <a href="tel:+212665644391" class="paragraph font-normal transition hover:text-green text-[#2E3A26]">+212 665-644391</a>
            <a href="mailto:contact@bayt-immo.com" class="small mt-1 transition hover:text-green text-[#2E3A26]">contact@bayt-immo.com</a>
            <span class="small text-golden mt-1">Boulevard M-18, Menara Marrakech, Maroc</span>
          </div>`;
retail = retail.replace(oldContactBlockRegex, newContactBlock);

fs.writeFileSync('retail-spaces.html', retail, 'utf8');
console.log('retail-spaces.html updated successfully');

// 2. Update index.html
let idxHtml = fs.readFileSync('index.html', 'utf8');

// Replace footer heading
idxHtml = idxHtml.replace(
  `<p class="heading-2 leading-tight font-light uppercase" data-anim="heading">REJOIGNEZ L'UNIVERS BAYTIMMO</p>`,
  `<p class="heading-2 leading-tight font-light uppercase text-pine-green" data-anim="heading">REJOIGNEZ L'UNIVERS DES JARDINS DE BALI</p>`
);

// Replace "Submit a request"
idxHtml = idxHtml.replaceAll('Submit a request', 'Déposer une demande');

// Replace "Privacy policy"
idxHtml = idxHtml.replace('Privacy policy', 'Politique de confidentialité');

fs.writeFileSync('index.html', idxHtml, 'utf8');
console.log('index.html updated successfully');

