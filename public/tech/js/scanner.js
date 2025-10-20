let techData = {};

async function fetchTech() {
    const res = await fetch('/api/tech');
    techData = await res.json();
    renderTech();
}

function renderTech() {
    const container = document.getElementById('tech-list');
    container.innerHTML = '';
    Object.keys(techData).forEach(name => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            ${name}: <span class="${techData[name].available ? 'available' : 'unavailable'}">
                ${techData[name].available ? 'Available' : 'Unavailable'}
            </span>
            <button onclick="toggle('${name}')">Toggle</button>
        `;
        container.appendChild(div);
    });
}

async function toggle(name) {
    techData[name].available = !techData[name].available;
    await fetch('/api/tech/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify([{name, change: 0, available: techData[name].available}])
    });
    renderTech();
}

fetchTech();
