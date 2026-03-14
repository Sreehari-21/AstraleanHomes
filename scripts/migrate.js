const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const dbPath = path.join(__dirname, '../data/db.json');

const files = [
  'Sofas.js', 'KingBeds.js', 'QueenBeds.js', 'Tables.js', 'Chairs.js',
  'Dining.js', 'Furnishings.js', 'Storage.js', 'Decor.js'
];

let allProducts = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const match = content.match(/const\s+\w+\s*=\s*(\[[\s\S]*?\]);/);
  if (match) {
    let arrStr = match[1];
    try {
      // safely evaluate the array literal from the file
      const arr = eval(`(${arrStr})`);
      const category = file.replace('.js', '').toLowerCase();
      arr.forEach(item => {
        item.category = category;
        allProducts.push(item);
      });
    } catch(e) {
      console.log('Failed to eval in ' + file, e);
    }
  }
});

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.products = allProducts;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Migrated', allProducts.length, 'products to db.json');
