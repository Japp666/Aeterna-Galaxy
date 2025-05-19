import { user, updateHUD, canAfford, deductResources, showMessage } from './user.js';

const ships = {
    small: { name: 'Fregată', cost: { metal: 100, crystal: 50, energy: 30 }, speed: 100 },
    medium: { name: 'Cruiser', cost: { metal: 250, crystal: 200, energy: 100 }, speed: 75 },
    large: { name: 'Battleship', cost: { metal: 500, crystal: 400, energy: 300 }, speed: 50 }
};

// Inițializare flotei jucătorului
user.fleet = {
    small: 0,
    medium: 0,
    large: 0
};

export function showFleet() {
    const container = document.getElementById('fleet');
    container.innerHTML = `
        <h2>Flota Ta</h2>
        <div class="fleet-constructor">
            ${Object.entries(ships).map(([type, data]) => `
                <div class="ship-card">
                    <h3>${data.name}</h3>
                    <p>Cost: ${formatCost(data.cost)}</p>
                    <p>Deții: ${user.fleet[type]}</p>
                    <button onclick="buildShip('${type}')">Construiește</button>
                </div>
            `).join('')}
        </div>
        <h3>Trimite flotă</h3>
        <div class="fleet-send">
            <label>Coordonate țintă:</label>
            <input id="targetCoords" type="text" placeholder="x,y">
            <label>Nave mici:</label><input id="sendSmall" type="number" min="0">
            <label>Nave medii:</label><input id="sendMedium" type="number" min="0">
            <label>Nave mari:</label><input id="sendLarge" type="number" min="0">
            <button onclick="sendFleet()">Trimite</button>
        </div>
    `;
}

window.buildShip = function (type) {
    const cost = ships[type].cost;

    if (!canAfford(cost)) {
        showMessage('Resurse insuficiente!');
        return;
    }

    deductResources(cost);
    user.fleet[type]++;
    updateHUD();
    showFleet();
    showMessage(`${ships[type].name} construită!`);
};

window.sendFleet = function () {
    const coords = document.getElementById('targetCoords').value.split(',');
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);
    const distance = Math.sqrt(x * x + y * y);
    
    const small = parseInt(document.getElementById('sendSmall').value || 0);
    const medium = parseInt(document.getElementById('sendMedium').value || 0);
    const large = parseInt(document.getElementById('sendLarge').value || 0);

    if (small > user.fleet.small || medium > user.fleet.medium || large > user.fleet.large) {
        showMessage('Nu ai suficiente nave!');
        return;
    }

    const totalFuel = (small * distance * 1) + (medium * distance * 2) + (large * distance * 3);
    if (!canAfford({ energy: totalFuel })) {
        showMessage(`Nu ai suficientă energie (necesar: ${Math.floor(totalFuel)})`);
        return;
    }

    deductResources({ energy: totalFuel });
    user.fleet.small -= small;
    user.fleet.medium -= medium;
    user.fleet.large -= large;
    updateHUD();
    showFleet();
    showMessage(`Flota a fost trimisă către (${x},${y})! Consum energie: ${Math.floor(totalFuel)}`);
};

function formatCost(cost) {
    return `M: ${cost.metal}, C: ${cost.crystal}, E: ${cost.energy}`;
}
