const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Statische Dateien
app.use(express.static("public"));
app.use("/data", express.static("data"));

// Pfade zu JSON-Dateien
const drinksFile = path.join(__dirname, "data", "drinks.json");
const techFile = path.join(__dirname, "data", "items.json");

// --------------------- Getränke ---------------------
// Neuer Endpoint für den Scanner (Frontend fetch: /api/drinks/scan)
app.post("/api/drinks/scan", (req, res) => {
  const { id, mode, count = 1 } = req.body;

  try {
    const data = JSON.parse(fs.readFileSync(drinksFile, "utf-8"));
    const entry = data[id];
    if (!entry) return res.json({ error: "Getränk nicht gefunden" });

    if (mode === "checkin") entry.quantity += count;
    else if (mode === "checkout") entry.quantity -= count;

    entry.lastScanned = new Date().toISOString();

    fs.writeFileSync(drinksFile, JSON.stringify(data, null, 2));

    res.json({ name: entry.name, quantity: entry.quantity });
  } catch (err) {
    console.error(err);
    res.json({ error: "Fehler beim Zugriff auf drinks.json" });
  }
});

// ---------------------- Tech ------------------------
app.post("/tech/save-scan", (req, res) => {
  const { id, mode } = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(techFile, "utf-8"));
    const item = data[id];
    if (!item) return res.json({ error: "Item nicht gefunden" });

    if (mode === "checkin") item.available = true;
    else if (mode === "checkout") item.available = false;
    else item.available = !item.available;

    fs.writeFileSync(techFile, JSON.stringify(data, null, 2));
    res.json({ item: { name: item.Name, available: item.available } });
  } catch {
    res.json({ error: "Fehler beim Zugriff auf items.json" });
  }
});

// -------- Box Lookup: zeigt Ziel-Box & Regal ----------
app.post("/tech/lookup-box", (req, res) => {
  const { id } = req.body;
  try {
    const data = JSON.parse(fs.readFileSync(techFile, "utf-8"));
    const item = data[id];
    if (!item) return res.json({ error: "Item nicht gefunden" });

    res.json({
      name: item.Name,
      box: item.Box,
      regal: item.Regal,
      available: item.available,
    });
  } catch {
    res.json({ error: "Fehler beim Zugriff auf items.json" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server läuft auf http://localhost:${PORT}`)
);
