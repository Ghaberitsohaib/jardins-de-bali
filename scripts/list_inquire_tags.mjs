import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const regex = /<[^>]*[Ii]nquire[^>]*>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[0]);
}

