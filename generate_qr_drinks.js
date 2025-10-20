// qr-generator.js
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Pfade
const drinksFile = path.resolve('./data/drinks.json');
const outputDir = path.resolve('./public/drinks/qrcodes');

// Drinks aus JSON laden
if (!fs.existsSync(drinksFile)) {
  console.error(`Drinks-Datei nicht gefunden: ${drinksFile}`);
  process.exit(1);
}

const drinksData = JSON.parse(fs.readFileSync(drinksFile, 'utf-8'));

// Ausgabeordner erstellen, falls nicht vorhanden
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function generateQR() {
  for (const [id, info] of Object.entries(drinksData)) {
    const filePath = path.join(outputDir, `${id}.png`);
    await QRCode.toFile(filePath, id, {
      color: { dark: '#000000', light: '#FFFFFF' },
      width: 300
    });
    console.log(`QR-Code für ${info.name} erstellt: ${filePath}`);
  }
}

generateQR().catch(console.error);
