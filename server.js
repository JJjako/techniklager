import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = "./data/items.json";

const getItems = () => JSON.parse(fs.readFileSync(DATA_FILE));
const saveItems = (items) => fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

// API: scan (check-in / check-out)
app.post("/api/scan", (req, res) => {
  const { id, mode } = req.body;
  const items = getItems();
  if (!items[id]) return res.status(404).json({ error: "Item not found" });

  items[id].status = mode === "checkout" ? "out" : "available";
  items[id].lastScanned = new Date().toISOString();
  saveItems(items);

  res.json(items[id]);
});

// API: get all items for dashboard
app.get("/api/items", (req, res) => res.json(getItems()));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
