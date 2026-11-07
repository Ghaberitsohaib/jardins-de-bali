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

// Common distinctively English words (words that NEVER exist in French)
const strictlyEnWords = [
  '\\bthe\\b', '\\band\\b', '\\bwith\\b', '\\bfor\\b', '\\bfrom\\b', '\\bthis\\b',
  '\\bthat\\b', '\\byour\\b', '\\btheir\\b', '\\babout\\b', '\\bspaces\\b', '\\bbusiness\\b',
  '\\bliving\\b', '\\bchapter\\b', '\\bworld\\b', '\\bjoin\\b', '\\boffice\\b', '\\bretails?\\b',
  '\\bapartments?\\b', '\\bunits?\\b', '\\bfloors?\\b', '\\brecessed\\b', '\\bbuilding\\b',
  '\\bviews?\\b', '\\bauthenticity\\b', '\\bmeetings?\\b', '\\bsetting\\b', '\\bpleasant\\b',
  '\\binspiring\\b', '\\batmosphere\\b', '\\becosystem\\b', '\\boperational\\b',
  '\\bconvenient\\b', '\\blocation\\b', '\\bamenities\\b', '\\bswimming\\b', '\\bpools?\\b',
  '\\bsanctuary\\b', '\\bdoorstep\\b', '\\bcurated\\b', '\\binquire\\b', '\\brights\\b',
  '\\breserved\\b', '\\bshortly\\b', '\\binquiry\\b', '\\binterests\\b', '\\bmore\\b',
  '\\bfind out\\b', '\\bexplore in 3d\\b', '\\bexplore spaces\\b', '\\binstallment\\b',
  '\\bpre-contract\\b', '\\bzero level\\b', '\\bcompleted\\b', '\\bcomplete\\b',
  '\\btechnical acceptance\\b', '\\bpermit\\b', '\\bfirst name\\b', '\\blast name\\b',
  '\\bdisclaimer\\b', '\\bupon completion\\b', '\\bdeviations\\b', '\\bfacade\\b'
];

const regexes = strictlyEnWords.map(w => new RegExp(w, 'i'));

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  const matches = [];

  lines.forEach((line, idx) => {
    // Strip scripts and styles
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    
    // Check if line matches strictly English patterns
    for (const r of regexes) {
      if (r.test(line)) {
        // Exclude script paths, attributes like type="module", href="...", etc. unless the text itself is English
        // Extract visible text:
        const clean = line.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (clean.length > 0 && r.test(clean)) {
          matches.push({ lineNum: idx + 1, text: clean, raw: line.trim() });
          break;
        }
      }
    }
  });

  if (matches.length > 0) {
    console.log(`\n=================== ${f} (${matches.length} matches) ===================`);
    matches.forEach(m => console.log(`L${m.lineNum}: [${m.text}]`));
  }
}
