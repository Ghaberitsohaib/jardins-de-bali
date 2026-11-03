import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('arbor-inquire-btn')) {
    console.log(f, 'has arbor-inquire-btn');
  }
}

