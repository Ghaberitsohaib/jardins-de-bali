import fs from 'fs';
import path from 'path';

const englishKeywords = [
  'Privacy policy',
  'All rights reserved',
  'JOIN THE WORLD',
  'EXPLORE SPACES',
  'DISCOVER',
  'BUSINESS SPACES',
  'First name',
  'Last name',
  'Send message',
  'Submit',
  'Read more',
  'All of this contributes'
];

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  englishKeywords.forEach(kw => {
    if (content.includes(kw)) {
      console.log(`[${f}] contains: "${kw}"`);
    }
  });
});
