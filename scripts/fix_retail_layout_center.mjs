import fs from 'fs';

let content = fs.readFileSync('retail-spaces.html', 'utf8');

// 1. Add .retail-picker-container CSS
const cssTarget = `.picker-sidebar {`;
const cssReplacement = `.retail-picker-container {
      width: 100%;
      max-width: 90rem;
      margin: 0 auto;
      padding: 0 2.5rem;
      display: flex;
      align-items: flex-start;
      gap: 3.5rem;
    }

    @media (max-width: 1024px) {
      .retail-picker-container {
        flex-direction: column;
        padding: 0 1.25rem;
        gap: 2rem;
      }
    }

    .picker-sidebar {`;

content = content.replace(cssTarget, cssReplacement);

// 2. Replace wrapper with retail-picker-container
content = content.replace(
  /<div class="wrapper flex items-start gap-8">/,
  '<div class="retail-picker-container">'
);

// 3. Replace w-2/3 with flex-1 min-w-0 w-full
content = content.replace(
  /<div class="relative w-2\/3 max-lg:w-full">/,
  '<div class="relative flex-1 min-w-0 w-full">'
);

fs.writeFileSync('retail-spaces.html', content, 'utf8');
console.log('retail-spaces.html updated with centered 90rem container and flex-1 grid.');

