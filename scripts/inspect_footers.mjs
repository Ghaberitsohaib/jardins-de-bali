import fs from 'fs';

function inspect(file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`=== ${file} ===`);
  const lines = html.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('<body') || l.includes('id="footer"')) {
      console.log(idx + 1, l.trim());
    }
  });
}

inspect('business.html');
inspect('retail-spaces.html');
inspect('index.html');
inspect('residences.html');

