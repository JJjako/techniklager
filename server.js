import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_DIR = path.join(__dirname, "data");
const FILES = {
  tech: path.join(DATA_DIR, "items.json"),
  drinks: path.join(DATA_DIR, "drinks.json"),
};

function getItems(type) {
  return JSON.parse(fs.readFileSync(FILES[type], "utf8"));
}
function saveItems(type, items) {
  fs.writeFileSync(FILES[type], JSON.stringify(items, null, 2));
}

// --- SCAN endpoint (supports "count") ---
app.post("/api/:type/scan", (req, res) => {
  const { type } = req.params;
  const { id, mode, count = 1 } = req.body;
  const items = getItems(type);
  if (!items[id]) return res.status(404).json({ error: "Item not found" });

  if (type === "drinks") {
    const qty = parseInt(count) || 1;
    if (mode === "checkout") items[id].quantity -= qty;
    else if (mode === "checkin") items[id].quantity += qty;
    if (items[id].quantity < 0) items[id].quantity = 0;
  } else {
    items[id].status = mode === "checkout" ? "out" : "available";
  }

  items[id].lastScanned = new Date().toISOString();
  saveItems(type, items);
  res.json(items[id]);
});

// --- Dashboard endpoint ---
app.get("/api/:type/items", (req, res) => {
  const { type } = req.params;
  res.json(getItems(type));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
