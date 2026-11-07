import fs from 'fs';
import path from 'path';

const phrases = [
  'Submit a request',
  'Privacy policy',
  'Terms of service',
  'All rights reserved',
  'Subscribe',
  'Learn more',
  'Read more',
  'View all',
  'Contact us',
  'Back to top',
  'Our services',
  'About us',
  'Get in touch',
  'Message sent',
  'Please enter',
  'Required field',
  'Send message',
  'Inquire now'
];

function scanDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'public_archive') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (item.endsWith('.html') || (item.endsWith('.js') && !item.includes('tailwind') && !item.includes('motion'))) {
      const content = fs.readFileSync(full, 'utf8');
      phrases.forEach(p => {
        if (content.toLowerCase().includes(p.toLowerCase())) {
          console.log(`[${full}] contains "${p}"`);
        }
      });
    }
  }
}

scanDir('.');
