import fs from 'fs';

const files = [
  'index.html',
  'business.html',
  'residences.html',
  'retail-spaces.html',
  'about-the-investor.html',
  'contact.html',
  'ventes.html',
  'maquette3d.html'
];

// Common English words that do NOT appear in French (or very rarely)
const enWords = new Set([
  'the', 'and', 'with', 'for', 'our', 'from', 'this', 'that', 'your', 'their',
  'about', 'more', 'all', 'spaces', 'business', 'living', 'chapter', 'new',
  'world', 'join', 'office', 'retails', 'apartments', 'units', 'floor', 'floors',
  'recessed', 'building', 'view', 'views', 'authentic', 'authenticity', 'meeting',
  'meetings', 'setting', 'pleasant', 'inspiring', 'atmosphere', 'ecosystem',
  'hub', 'operational', 'processes', 'convenient', 'location', 'amenities',
  'fitness', 'rooftop', 'swimming', 'pools', 'sanctuary', 'doorstep', 'curated',
  'inquire', 'rights', 'reserved', 'share', 'advisors', 'shortly', 'inquiry',
  'thank', 'sent', 'explore', 'contact', 'full', 'name', 'tell', 'us', 'which',
  'interests', 'you', 'send', 'message', 'privacy', 'policy', 'terms'
]);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=================== FILE: ${f} ===================`);
  lines.forEach((line, idx) => {
    // Strip HTML tags
    const text = line.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').trim();
    if (!text || text.startsWith('//') || text.startsWith('/*')) return;
    
    // Check words
    const words = text.toLowerCase().match(/[a-z']+/g) || [];
    let enCount = 0;
    words.forEach(w => {
      if (enWords.has(w)) enCount++;
    });

    // If more than 3 English words or specific phrases, print line
    if (
      enCount >= 2 ||
      text.includes('Office') ||
      text.includes('Spaces') ||
      text.includes('Retails') ||
      text.includes('Explore') ||
      text.includes('JOIN THE WORLD') ||
      text.includes('All Rights Reserved') ||
      text.includes('Inquire') ||
      text.includes('Menu')
    ) {
      // Ignore known French lines that happen to match 2 small words or code
      if (!line.includes('<script') && !line.includes('<style') && !line.includes('class="') && !line.includes('<meta')) {
        console.log(`L${idx+1}: ${text}`);
      }
    }
  });
});
