import fs from "fs";
import path from "path";
import QRCode from "qrcode";

const itemsFile = "./data/items.json";
const outDir = "./public/qrcodes/tech";

fs.mkdirSync(outDir, { recursive: true });

const items = JSON.parse(fs.readFileSync(itemsFile, "utf-8"));

for (const [id] of Object.entries(items)) {
  const url = `http://localhost:3000/tech/scanner.html?id=${encodeURIComponent(id)}`;
  const file = path.join(outDir, `${id}.png`);
  await QRCode.toFile(file, url, { width: 300 });
  console.log("✅ QR created:", file);
}
