const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const drinksFile = path.join(__dirname, "data/drinks.json");

// --- Get all drinks ---
app.get("/api/drinks", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(drinksFile, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.json({ error: "Fehler beim Laden der Drinkster.json" });
  }
});

// --- Update drink quantity ---
app.post("/api/drinks/update", (req, res) => {
  const { id, mode, count = 1 } = req.body;

  try {
    const data = JSON.parse(fs.readFileSync(drinksFile, "utf-8"));
    const drink = data[id];
    if (!drink) return res.json({ error: "Getränk nicht gefunden" });

    if (mode === "checkin") drink.quantity += count;
    else if (mode === "checkout") drink.quantity -= count;

    if (drink.quantity < 0) drink.quantity = 0;

    drink.lastUpdated = new Date().toISOString();

    fs.writeFileSync(drinksFile, JSON.stringify(data, null, 2));
    res.json({ success: true, drink });
  } catch (err) {
    console.error(err);
    res.json({ error: "Fehler beim Aktualisieren der Drinkster.json" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Getränkeplattform läuft auf http://localhost:${PORT}`)
);
