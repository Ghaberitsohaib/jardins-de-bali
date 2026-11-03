import fs from 'fs';

const html = fs.readFileSync('retail-spaces.html', 'utf8');
const queries = ['FILTRES COMMERCIAUX', '12 RESULTS', '12 results', 'FILTRES'];
for (const q of queries) {
  let idx = 0;
  while ((idx = html.indexOf(q, idx)) !== -1) {
    console.log(`Found "${q}" at ${idx}:`);
    console.log(html.substring(Math.max(0, idx - 100), idx + 250));
    idx += q.length;
  }
}

