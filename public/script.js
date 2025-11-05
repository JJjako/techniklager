const dashboardBody = document.getElementById("dashboardBody");
const drinkSelect = document.getElementById("drinkSelect");
const amountInput = document.getElementById("amount");
const modeSelect = document.getElementById("mode");
const applyBtn = document.getElementById("applyBtn");
const statusDiv = document.getElementById("status");

let drinksData = {};

async function loadDrinks() {
  const res = await fetch("/api/drinks");
  drinksData = await res.json();
  renderDashboard();
  populateSelect();
}

function renderDashboard() {
  dashboardBody.innerHTML = "";
  for (const [id, drink] of Object.entries(drinksData)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${drink.name}</td><td>${drink.quantity}</td><td>${drink.lastUpdated || "-"}</td>`;
    dashboardBody.appendChild(tr);
  }
}

function populateSelect() {
  drinkSelect.innerHTML = "";
  for (const id of Object.keys(drinksData)) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = drinksData[id].name;
    drinkSelect.appendChild(option);
  }
}

applyBtn.addEventListener("click", async () => {
  const id = drinkSelect.value;
  const mode = modeSelect.value;
  const count = parseInt(amountInput.value, 10) || 1;

  const res = await fetch("/api/drinks/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, mode, count })
  });
  const data = await res.json();
  if (data.error) {
    statusDiv.textContent = "❌ " + data.error;
  } else {
    statusDiv.textContent = `✅ ${data.drink.name}: neuer Bestand ${data.drink.quantity}`;
    await loadDrinks();
  }
});

loadDrinks();
