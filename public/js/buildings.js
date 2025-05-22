// public/js/buildings.js
import { getPlayer, addBuildingToQueue } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

const buildingsData = {
    'power_plant': {
        id: 'power_plant',
        name: 'Centrală Energetică',
        description: 'Produce energie vitală pentru colonie.',
        image: 'https://via.placeholder.com/280x150', // Placeholder valid
        cost: { metal: 50, crystal: 20, energy: 0, helium: 0 },
        buildTime: 5
    },
    'mineral_mine': {
        id: 'mineral_mine',
        name: 'Mină de Minerale',
        description: 'Extrage minerale din sol.',
        image: 'https://via.placeholder.com/280x150', // Placeholder valid
        cost: { metal: 40, crystal: 0, energy: 10, helium: 0 },
        buildTime: 4
    }
};

export function initBuildingsPage() {
    const player = getPlayer();
    const buildingsContainer = document.querySelector('.buildings-container');
    if (!buildingsContainer) {
        console.error("Elementul .buildings-container nu a fost găsit.");
        return;
    }

    let buildingListElement = buildingsContainer.querySelector('.building-list');
    if (!buildingListElement) {
        buildingListElement = document.createElement('div');
        buildingListElement.className = 'building-list';
        buildingsContainer.appendChild(buildingListElement);
    }

    buildingListElement.innerHTML = '';

    Object.values(buildingsData).forEach(building => {
        const buildingCard = document.createElement('div');
        buildingCard.className = 'building-card';
        buildingCard.innerHTML = `
            <img src="${building.image}" alt="${building.name}" class="card-image" onerror="this.src='https://via.placeholder.com/280x150';">
            <h3 class="card-title">${building.name}</h3>
            <p class="card-description">${building.description}</p>
            <p>Cost: Metal: ${building.cost.metal || 0}, Cristal: ${building.cost.crystal || 0}, Energie: ${building.cost.energy || 0}, Heliu: ${building.cost.helium || 0}</p>
            <p>Timp de construcție: ${building.buildTime} secunde</p>
            <button class="build-button" data-building-id="${building.id}">Construiește</button>
            <div class="progress-bar-container" style="display: none;">
                <div class="progress-bar">
                    <span class="progress-text"></span>
                </div>
            </div>
        `;
        buildingListElement.appendChild(buildingCard);
    });

    buildingListElement.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const buildingId = event.target.dataset.buildingId;
            const building = buildingsData[buildingId];
            if (building) {
                let hasResources = true;
                for (const resourceType in building.cost) {
                    if (player.resources[resourceType] === undefined || player.resources[resourceType] < building.cost[resourceType]) {
                        hasResources = false;
                        showMessage(`Nu ai suficiente ${resourceType} pentru a construi ${building.name}!`, 'error');
                        break;
                    }
                }

                if (hasResources) {
                    for (const resourceType in building.cost) {
                        player.resources[resourceType] -= building.cost[resourceType];
                    }
                    updateHUD();
                    addBuildingToQueue(buildingId, building.buildTime);
                    showMessage(`Construcția clădirii "${building.name}" a început!`, 'success');
                }
            }
        });
    });
}
