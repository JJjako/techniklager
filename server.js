const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

// Statische Dateien
app.use(express.static('public'));
app.use('/data', express.static('data')); // JSON ausliefern

// --- Getränke Scanner / Save ---
app.post('/drinks/save-scan', (req, res) => {
  const { id, mode, count = 1 } = req.body;
  const filePath = path.join(__dirname, 'data', 'drinks.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!data[id]) return res.json({ error: 'Getränk nicht gefunden' });
  data[id] += (mode === 'checkin' ? count : -count);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ name: id, quantity: data[id] });
});

// --- Tech Scanner / Save ---
app.post('/tech/save-scan', (req, res) => {
  const { id } = req.body;
  const filePath = path.join(__dirname, 'data', 'items.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!data[id]) return res.json({ error: 'Item nicht gefunden' });
  data[id].available = !data[id].available;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ item: { name: id, available: data[id].available } });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
