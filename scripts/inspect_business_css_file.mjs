import fs from 'fs';

if (fs.existsSync('src/business.css')) {
  console.log('src/business.css exists, length:', fs.readFileSync('src/business.css', 'utf8').length);
  console.log(fs.readFileSync('src/business.css', 'utf8').substring(0, 1000));
} else {
  console.log('src/business.css does not exist');
}

