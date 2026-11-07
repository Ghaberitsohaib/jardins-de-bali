import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/retail-spaces-data.json', 'utf8'));

const thumbMap = {
  'MAGASIN 1': '/business/retail/magasin_1_boutique.jpg',
  'MAGASIN 2': '/business/retail/magasin_2_flagship.jpg',
  'MAGASIN 3': '/business/retail/magasin_3_concept.jpg',
  'MAGASIN 4': '/business/retail/magasin_4_showroom.jpg',
  'MEZZANINE 1': '/jardins_de_bali/commercial_hero_luxury_hd.jpg',
  'MEZZANINE 2': '/jardins_de_bali/14_rendu_3d_facade_rue.jpg',
  'FLAGSHIP DUPLEX A': '/business/hero.webp',
  'FLAGSHIP DUPLEX B': '/jardins_de_bali/13_facade_angle_terrasses.jpg',
  'BUREAU PRO 101': '/business/retail/bureau_executive_suite_bali.jpg',
  'BUREAU PRO 102': '/business/retail/bureau_executive_suite_bali.jpg',
  'CORPORATE 201': '/jardins_de_bali/12_facade_gradins_vegetalisee.jpg',
  'ROOFTOP LOUNGE 501': '/jardins_de_bali/rooftop_culinary_lounge_hd.jpg'
};

data.forEach(item => {
  item.thumbImg = thumbMap[item.id] || '/business/retail/magasin_1_boutique.jpg';
});

fs.writeFileSync('src/data/retail-spaces-data.json', JSON.stringify(data, null, 2), 'utf8');
console.log('src/data/retail-spaces-data.json updated with thumbImg for all items');
