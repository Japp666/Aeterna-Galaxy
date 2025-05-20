// js/fleet.js
import { user, saveUserData } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

export const shipData = [
    {
        id: 'fighter',
        name: 'Vânător',
        description: 'Navă de luptă rapidă și agilă, bună pentru atacuri rapide.',
        baseCost: { metal: 150, crystal: 50, energy: 30 },
        buildTime: 10, // seconds
        attack: 10,
        defense: 5,
        imageUrl: 'https://i.postimg.cc/t4g7xL71/fleet-fighter.jpg', // Link extern
        unlock: () => (user.buildings.barracks || 0) >= 1, // Necesită Baracă Nivel 1
        unlockRequirementText: 'Necesită Baracă Nivel 1'
    },
    {
        id: 'bomber',
        name: 'Bombardier',
        description: 'Navă grea, ideală pentru bombardarea bazelor inamice.',
        baseCost: { metal: 400, crystal: 200, energy: 100 },
        buildTime: 25, // seconds
        attack: 30,
        defense: 15,
        imageUrl: 'https://i.postimg.cc/rpqH7cQd/fleet-bomber.jpg', // Link extern
        unlock: () => (user.buildings.barracks || 0) >= 2, // Necesită Baracă Nivel 2
        unlockRequirementText: 'Necesită Baracă Nivel 2'
    },
    {
        id: 'frigate',
        name: 'Fregată',
        description: 'Nava versatilă, bună pentru escortă și patrulare.',
        baseCost: { metal: 800, crystal: 400, energy: 200 },
        buildTime: 40, // seconds
        attack: 20,
        defense: 40,
        imageUrl: 'https://i.postimg.cc/Xqc84N0b/fleet-frigate.jpg', // Link extern
        unlock: () => (user.buildings.barracks || 0) >= 3, // Necesită Baracă Nivel 3
        unlockRequirementText: 'Necesită Baracă Nivel 3'
    }
];

export function showFleet() {
    const container = document.getElementById('fleetTab');
    container.innerHTML = `<h2>Flota Ta</h2><div class="fleet-summary"></div><div class="ship-list building-list"></div>`;

    const fleetSummaryDiv = container.querySelector('.fleet-summary');
    const shipListDiv = container.querySelector('.ship-list');

    // Afișează sumarul flotei actuale
    let totalShips = 0;
    let summaryHtml = '<p>Nave construite:</p><ul>';
    for (const shipId in user.fleet) {
        if (user.fleet[shipId] > 0) {
            const ship = shipData.find(s => s.id === shipId);
            if (ship) {
                summaryHtml += `<li>${ship.name}: ${user.fleet[shipId]}</li>`;
                totalShips += user.fleet[shipId];
            }
        }
    }
    summaryHtml += `</ul><p>Total nave: ${totalShips}</p>`;
    fleetSummaryDiv.innerHTML = summaryHtml;

    // Afișează cardurile pentru construcția de nave noi
    shipData.forEach(ship => {
        const isUnlocked = ship.unlock();
        const cardDiv = document.createElement('div');
        cardDiv.className = `building-card ${!isUnlocked ? 'locked' : ''} ship-card`;
        cardDiv.innerHTML = `
            <h3>${ship.name}</h3>
            <img src="${ship.imageUrl}" alt="${ship.name}" class="building-image">
            <p>${ship.description}</p>
            <p>Atac: ${ship.attack} | Apărare: ${ship.defense}</p>
            <p>Cost construcție: ${formatCost(ship.baseCost)}</p>
            <button ${!isUnlocked ? 'disabled' : ''} data-ship-id="${ship.id}">
                Construiește
            </button>
            <div class="progress-container">
                <div class="progress-bar" id="ship-${ship.id}-bar"></div>
                <span class="progress-text" id="ship-${ship.id}-text"></span>
            </div>
        `;
        if (!isUnlocked) {
            cardDiv.setAttribute('data-requirements', ship.unlockRequirementText);
        }
        shipListDiv.appendChild(cardDiv);
    });

    document.querySelectorAll('#fleetTab button').forEach(button => {
        button.addEventListener('click', (event) => {
            const shipId = event.target.dataset.shipId;
            buildShip(shipId);
        });
    });
}

function buildShip(id) {
    const ship = shipData.find(s => s.id === id);
    const cost = ship.baseCost;

    if (!canAfford(cost)) {
        showMessage('Nu ai suficiente resurse pentru a construi nava.', 'error');
        return;
    }

    deductResources(cost);
    updateHUD();

    const progressBar = document.getElementById(`ship-${id}-bar`);
    const text = document.getElementById(`ship-${id}-text`);
    if (!progressBar || !text) {
        console.error(`Elementele de progres pentru navă ${id} nu au fost găsite.`);
        showMessage('Eroare: Nu s-au găsit elementele de progres pentru construcția navei.', 'error');
        return;
    }

    let seconds = ship.buildTime;
    progressBar.style.width = '0%';
    let elapsed = 0;

    const interval = setInterval(() => {
        elapsed++;
        const percent = Math.min((elapsed / seconds) * 100, 100);
        progressBar.style.width = `${percent}%`;
        text.textContent = `${seconds - elapsed}s`;

        if (elapsed >= seconds) {
            clearInterval(interval);
            user.fleet[id] = (user.fleet[id] || 0) + 1;
            user.score += ship.attack + ship.defense;
            showMessage(`O navă "${ship.name}" a fost construită!`, 'success');
            showFleet();
            updateHUD();
            saveUserData();
        }
    }, 1000);
}

function canAfford(cost) {
    return ['metal', 'crystal', 'energy'].every(
        r => user.resources[r] >= cost[r]
    );
}

function deductResources(cost) {
    ['metal', 'crystal', 'energy'].forEach(r => {
        user.resources[r] -= cost[r];
    });
}

function formatCost(cost) {
    return `M: ${cost.metal}, C: ${cost.crystal}, E: ${cost.energy}`;
}
