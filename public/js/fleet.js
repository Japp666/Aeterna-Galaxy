// js/fleet.js
import { getUserData, updateResources, setUserFleetUnit, getPlayerRace } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

// Definim structura de bază a navelor
const fleetUnits = {
    fighter: {
        name: "Vânător",
        description: "Navă rapidă, bună pentru atacuri rapide.",
        baseCost: { metal: 100, crystal: 50, energy: 10 },
        buildTime: 5000, // 5 secunde
        attack: 10,
        defense: 5,
        imageUrl: "img/fighter.png", // Asigură-te că ai imaginea
        maxUnits: 100 // Nivel maxim pentru fiecare unitate
    },
    cruiser: {
        name: "Crucișător",
        description: "Navă echilibrată, versatilă în luptă.",
        baseCost: { metal: 300, crystal: 150, energy: 30 },
        buildTime: 15000, // 15 secunde
        attack: 30,
        defense: 20,
        imageUrl: "img/cruiser.png", // Asigură-te că ai imaginea
        maxUnits: 50
    },
    // Adaugă alte tipuri de nave aici
};

const fleetQueue = {}; // Coada de construcție flotă { unitId: { count: X, endTime: Y, element: Z } }

export function renderFleet() {
    const fleetTab = document.getElementById('fleetTab');
    if (!fleetTab) {
        console.error("fleetTab element not found!");
        return;
    }
    fleetTab.innerHTML = '<h2>Flotă</h2><p>Construiește o flotă impresionantă de nave spațiale. Fiecare tip de navă are propriile sale puncte forte și slăbiciuni, esențiale pentru apărarea bazei și pentru expedițiile militare.</p><div class="fleet-list"></div>';
    const fleetList = fleetTab.querySelector('.fleet-list');

    const userFleet = getUserData().fleet;

    for (const id in fleetUnits) {
        const unit = fleetUnits[id];
        const currentCount = userFleet[id] || 0;

        if (currentCount >= unit.maxUnits) {
            const fleetCard = document.createElement('div');
            fleetCard.className = 'fleet-card';
            fleetCard.innerHTML = `
                <img src="${unit.imageUrl || 'img/default_ship.png'}" alt="${unit.name}" class="fleet-image">
                <h3>${unit.name}</h3>
                <p>Unități deținute: ${currentCount} (Max)</p>
                <p>${unit.description}</p>
                <button disabled>Capacitate Maximă Atingută</button>
            `;
            fleetList.appendChild(fleetCard);
            continue;
        }

        const cost = calculateFleetCost(unit.baseCost);
        const buildTime = calculateFleetBuildTime(unit.buildTime);

        const fleetCard = document.createElement('div');
        fleetCard.className = 'fleet-card';
        fleetCard.dataset.id = id;

        fleetCard.innerHTML = `
            <img src="${unit.imageUrl || 'img/default_ship.png'}" alt="${unit.name}" class="fleet-image">
            <h3>${unit.name}</h3>
            <p>Unități deținute: ${currentCount}</p>
            <p>${unit.description}</p>
            <p>Cost per unitate: Metal: ${cost.metal}, Cristal: ${cost.crystal}, Energie: ${cost.energy}</p>
            <p>Timp construcție: ${formatTime(buildTime / 1000)}</p>
            <button class="build-fleet-btn" data-id="${id}"
                    data-metal="${cost.metal}"
                    data-crystal="${cost.crystal}"
                    data-energy="${cost.energy}"
                    data-time="${buildTime}">Construiește</button>
            <div class="progress-container" style="display: none;">
                <div class="progress-bar"></div>
                <div class="progress-text"></div>
            </div>
        `;
        fleetList.appendChild(fleetCard);
    }

    addFleetEventListeners();
    updateFleetProgressBars(); // Inițializează barele de progres la randare
}

function addFleetEventListeners() {
    document.querySelectorAll('.build-fleet-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const unitId = event.target.dataset.id;
            const costMetal = parseInt(event.target.dataset.metal);
            const costCrystal = parseInt(event.target.dataset.crystal);
            const costEnergy = parseInt(event.target.dataset.energy);
            const buildTime = parseInt(event.target.dataset.time);

            const userData = getUserData();
            const currentCount = userData.fleet[unitId] || 0;
            const maxUnits = fleetUnits[unitId].maxUnits;

            if (currentCount >= maxUnits) {
                showMessage(`Ai atins numărul maxim de unități pentru ${fleetUnits[unitId].name}!`, "error");
                return;
            }

            if (userData.resources.metal < costMetal || userData.resources.crystal < costCrystal || userData.resources.energy < costEnergy) {
                showMessage("Resurse insuficiente pentru a construi navă!", "error");
                return;
            }

            // Permite construcția multiplă, dar fiecare trebuie să fie în coadă
            // Aici ar trebui o logică mai complexă dacă vrei o singură coadă globală
            // Pentru simplitate, vom permite o singură navă de un anumit tip să fie în coadă la un moment dat
            if (fleetQueue[unitId]) {
                showMessage(`O unitate ${fleetUnits[unitId].name} este deja în construcție!`, "info");
                return;
            }


            updateResources(-costMetal, -costCrystal, -costEnergy);
            updateHUD();
            showMessage(`Construcție "${fleetUnits[unitId].name}" începută!`, "success");

            const card = event.target.closest('.fleet-card');
            const progressBarContainer = card.querySelector('.progress-container');
            const progressBar = card.querySelector('.progress-bar');
            const progressText = card.querySelector('.progress-text');
            const buildButton = event.target;

            buildButton.disabled = true;
            progressBarContainer.style.display = 'block';

            const startTime = Date.now();
            const endTime = startTime + buildTime;

            fleetQueue[unitId] = {
                count: (userData.fleet[unitId] || 0) + 1, // Următoarea unitate
                endTime: endTime,
                element: { progressBar: progressBar, progressText: progressText, button: buildButton, card: card }
            };

            updateFleetProgress(unitId);
        });
    });
}

function updateFleetProgress(unitId) {
    const item = fleetQueue[unitId];
    if (!item) return;

    const now = Date.now();
    const remainingTime = item.endTime - now;

    if (remainingTime <= 0) {
        const unit = fleetUnits[unitId];
        const currentCount = (getUserData().fleet[unitId] || 0) + 1; // Unitatea tocmai finalizată
        setUserFleetUnit(unitId, currentCount); // Setează noul număr de unități
        showMessage(`O unitate "${unit.name}" a fost finalizată!`, "success");

        updateHUD(); // Actualizează HUD-ul dacă flota are impact vizibil acolo

        item.element.progressBar.style.width = '100%';
        item.element.progressText.textContent = 'Finalizat!';
        item.element.button.disabled = false;
        item.element.card.classList.remove('fleet-in-progress');

        setTimeout(() => {
            item.element.progressBar.style.width = '0%';
            item.element.progressText.textContent = '';
            item.element.progressBar.parentNode.style.display = 'none';
            delete fleetQueue[unitId];
            renderFleet(); // Re-randare pentru a actualiza numărul de unități și butoanele
        }, 1000);
    } else {
        const totalTime = item.endTime - (item.endTime - fleetUnits[unitId].buildTime);
        const progress = ((totalTime - remainingTime) / totalTime) * 100;
        item.element.progressBar.style.width = `${progress}%`;
        item.element.progressText.textContent = `${formatTime(remainingTime / 1000)}`;

        requestAnimationFrame(() => updateFleetProgress(unitId));
    }
}

function updateFleetProgressBars() {
    const now = Date.now();
    for (const unitId in fleetQueue) {
        const item = fleetQueue[unitId];
        const remainingTime = item.endTime - now;

        if (remainingTime > 0) {
            const card = document.querySelector(`.fleet-card[data-id="${unitId}"]`);
            if (card) {
                const progressBarContainer = card.querySelector('.progress-container');
                const progressBar = card.querySelector('.progress-bar');
                const progressText = card.querySelector('.progress-text');
                const buildButton = card.querySelector('.build-fleet-btn');

                if (progressBarContainer && progressBar && progressText && buildButton) {
                    progressBarContainer.style.display = 'block';
                    buildButton.disabled = true;
                    item.element = { progressBar: progressBar, progressText: progressText, button: buildButton, card: card };
                    requestAnimationFrame(() => updateFleetProgress(unitId));
                }
            }
        } else {
            const unit = fleetUnits[unitId];
            const currentCount = (getUserData().fleet[unitId] || 0) + 1;
            setUserFleetUnit(unitId, currentCount);
            updateHUD();
            showMessage(`O unitate "${unit.name}" a fost finalizată!`, "success");
            delete fleetQueue[unitId];
            renderFleet();
        }
    }
}

function calculateFleetCost(baseCost) {
    // Costul navelor nu crește cu nivelul, ci e per unitate
    return {
        metal: baseCost.metal,
        crystal: baseCost.crystal,
        energy: baseCost.energy
    };
}

function calculateFleetBuildTime(baseTime) {
    return baseTime; // Timpul de construcție este fix per unitate
}

function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let parts = [];
    if (days > 0) parts.push(`${days}z`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
}
