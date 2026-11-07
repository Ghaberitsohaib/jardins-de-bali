import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

// English indicators / regex
const commonEnglishWords = [
  'the', 'and', 'with', 'for', 'our', 'more than', 'designed for', 'features',
  'exclusive', 'residence', 'residences', 'living', 'chapter', 'prestigious',
  'join the world', 'explore', 'explore spaces', 'inquire', 'all rights reserved',
  'office spaces and retails', 'business spaces', 'all premises', 'hospitality units',
  'view all', 'first floor', 'ground floor', 'top floor', 'surfaces', 'underground'
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n=================== ${file} ===================`);
  
  // Extract visible text (strip scripts and styles)
  const noScript = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const textNodes = noScript.match(/>([^<]+)</g) || [];
  
  const englishFindings = [];
  textNodes.forEach(n => {
    const text = n.replace(/^>|<$/g, '').trim();
    if (text.length > 5) {
      // Check for English patterns
      const lower = text.toLowerCase();
      // specifically check for obvious English sentences or headings
      if (
        lower.includes('join the world') ||
        lower.includes('explore spaces') ||
        lower.includes('explore our') ||
        lower.includes('office spaces and') ||
        lower.includes('all of this contributes') ||
        lower.includes('the space\'s authenticity') ||
        lower.includes('top recessed floor') ||
        lower.includes('a new chapter in') ||
        lower.includes('is more than a residence') ||
        lower.includes('all rights reserved') ||
        lower.includes('designed for companies') ||
        lower.includes('share your inquiry') ||
        lower.includes('your full name') ||
        lower.includes('tell us which') ||
        lower.includes('thank you! your') ||
        lower.includes('features top-notch') ||
        lower.includes('close proximity to') ||
        lower.includes('adaptable to various') ||
        lower.includes('all premises are situated') ||
        lower.includes('distributed evenly') ||
        lower.includes('convenient location') ||
        lower.includes('informal meetings') ||
        lower.includes('pleasant and inspiring')
      ) {
        englishFindings.push(text);
      }
    }
  });

  const unique = Array.from(new Set(englishFindings));
  if (unique.length) {
    unique.forEach(t => console.log(' [EN]:', t));
  } else {
    console.log(' (No targeted English text detected with this filter)');
  }
});

