// js/fleet.js

import { getUserData, setUserFleetUnit, updateResources } from './user.js';
import { showMessage } from './utils.js';

// Costurile unităților
const unitCosts = {
    fighter: { metal: 2000, crystal: 1000, energy: 500 },
    cruiser: { metal: 6000, crystal: 3000, energy: 1500 },
    battleship: { metal: 12000, crystal: 6000, energy: 3000 },
    colonyShip: { metal: 10000, crystal: 5000, energy: 2000 },
    recycler: { metal: 8000, crystal: 4000, energy: 2000 },
    spyProbe: { metal: 500, crystal: 1000, energy: 200 }
};

/**
 * Randarează interfața flotei.
 */
export function renderFleet() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const fleetContainer = document.createElement('div');
    fleetContainer.className = 'fleet-container';
    fleetContainer.innerHTML = `
        <h2>Flota ta</h2>
        <p>Construiește și gestionează navele tale.</p>
        <div class="fleet-list"></div>
    `;
    mainContent.appendChild(fleetContainer);

    const fleetList = fleetContainer.querySelector('.fleet-list');
    const userData = getUserData();

    for (const unitType in unitCosts) {
        const unit = document.createElement('div');
        unit.className = 'fleet-unit';
        // Aici poți adăuga imagini pentru nave, similar cu clădirile
        // <img src="/public/img/fleet/${unitType}.png" alt="${unitType}">
        unit.innerHTML = `
            <h3>${unitType.charAt(0).toUpperCase() + unitType.slice(1)}</h3>
            <p>Deținut: <span id="${unitType}-count">${userData.fleet[unitType] || 0}</span></p>
            <p>Cost: Metal: ${unitCosts[unitType].metal}, Cristal: ${unitCosts[unitType].crystal}, Energie: ${unitCosts[unitType].energy}</p>
            <input type="number" id="${unitType}-build-input" value="1" min="1">
            <button class="build-button" data-unit-type="${unitType}">Construiește</button>
        `;
        fleetList.appendChild(unit);
    }

    // Adaugă event listeners pentru butoanele de construcție
    fleetList.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const unitType = event.target.dataset.unitType;
            const inputElement = document.getElementById(`${unitType}-build-input`);
            const quantity = parseInt(inputElement.value);

            if (isNaN(quantity) || quantity <= 0) {
                showMessage("Cantitate invalidă.", "error");
                return;
            }

            const cost = unitCosts[unitType];
            const userData = getUserData();

            if (userData.resources.metal >= cost.metal * quantity &&
                userData.resources.crystal >= cost.crystal * quantity &&
                userData.resources.energy >= cost.energy * quantity) {

                updateResources(
                    -(cost.metal * quantity),
                    -(cost.crystal * quantity),
                    -(cost.energy * quantity)
                );
                setUserFleetUnit(unitType, (userData.fleet[unitType] || 0) + quantity);
                document.getElementById(`${unitType}-count`).textContent = getUserData().fleet[unitType];
                showMessage(`Ai construit ${quantity} ${unitType}(e)!`, "success");
            } else {
                showMessage("Resurse insuficiente!", "error");
            }
        });
    });
}
