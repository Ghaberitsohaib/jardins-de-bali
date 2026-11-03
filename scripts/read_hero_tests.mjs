import fs from 'fs';

console.log(fs.readFileSync('scripts/test_hero_m.mjs', 'utf8'));
console.log('--- test_hero_m_timestamps.mjs ---');
console.log(fs.readFileSync('scripts/test_hero_m_timestamps.mjs', 'utf8'));

