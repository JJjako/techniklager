import fs from "fs";
import QRCode from "qrcode";

const items = JSON.parse(fs.readFileSync("./data/items.json"));

// Make sure output folder exists
if (!fs.existsSync("./public/qrcodes")) fs.mkdirSync("./public/qrcodes");

for (const id of Object.keys(items)) {
  const outputFile = `./public/qrcodes/${id}.png`;
  const url = id; // QR code only encodes the item ID
  QRCode.toFile(outputFile, url, { width: 300 }, (err) => {
    if (err) console.error("Error generating QR for", id, err);
    else console.log("QR generated for", id);
  });
}
