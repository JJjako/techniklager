const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // npm install csv-parser

const csvFile = path.join(__dirname, 'DIIN_Item-list - 20251017.CSV');
const jsonFile = path.join(__dirname, 'data', 'items.json');

const results = {};

fs.createReadStream(csvFile)
  .pipe(csv())
  .on('data', (row) => {
    // Annahme: erste Spalte ist der Item-Name
    const name = Object.values(row)[0].trim();
    if (name) results[name] = { available: true };
  })
  .on('end', () => {
    fs.writeFileSync(jsonFile, JSON.stringify(results, null, 2));
    console.log(`✅ items.json erfolgreich generiert mit ${Object.keys(results).length} Items`);
  });
