import fs from 'fs';
import path from 'path';

const pages = [
  'index.html',
  'residences.html',
  'business.html',
  'retail-spaces.html',
  'ventes.html',
  'maquette3d.html',
  'about-the-investor.html',
  'contact.html'
];

const results = {};

for (const page of pages) {
  if (!fs.existsSync(page)) continue;
  const content = fs.readFileSync(page, 'utf-8');
  results[page] = {
    brokenLinks: [],
    brokenImages: [],
    brokenScripts: [],
    meta: {
      hasTitle: /<title>/.test(content),
      title: content.match(/<title>(.*?)<\/title>/)?.[1] || 'NONE',
      hasViewport: /name=["']viewport["']/.test(content),
      hasDescription: /name=["']description["']/.test(content),
      hasOgImage: /property=["']og:image["']/.test(content),
      hasFavicon: /rel=["'](shortcut )?icon["']/.test(content)
    }
  };

  // Check links
  const hrefs = [...content.matchAll(/href=["']([^"'#]+)["']/g)].map(m => m[1]);
  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    let cleanPath = href.split('?')[0];
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
    if (!cleanPath) continue;
    const exists = fs.existsSync(cleanPath) || fs.existsSync(path.join('public', cleanPath));
    if (!exists) {
      results[page].brokenLinks.push(href);
    }
  }

  // Check images and scripts
  const srcs = [...content.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
  for (const src of srcs) {
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    let cleanPath = src.split('?')[0];
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
    if (!cleanPath) continue;
    const exists = fs.existsSync(cleanPath) || fs.existsSync(path.join('public', cleanPath));
    if (!exists) {
      if (src.endsWith('.js') || src.endsWith('.ts')) {
        results[page].brokenScripts.push(src);
      } else {
        results[page].brokenImages.push(src);
      }
    }
  }
}

console.log(JSON.stringify(results, null, 2));

