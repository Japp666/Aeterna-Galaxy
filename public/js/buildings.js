console.log('buildings.js loaded successfully');
import { getPlayer, addBuildingToQueue } from './user.js';
import { showMessage } from './utils.js';

try {
    const buildingsData = {
        'metal-mine': { name: 'Mină de Metal', cost: { metal: 100, crystal: 50 }, buildTime: 60 },
        'crystal-mine': { name: 'Mină de Cristal', cost: { metal: 120, crystal: 60 }, buildTime: 80 },
        'helium-mine': { name: 'Mină de Heliu', cost: { metal: 150, crystal: 80 }, buildTime: 100 },
        'power-plant': { name: 'Centrală Energetică', cost: { metal: 200, crystal: 100 }, buildTime: 120 },
        'metal-storage': { name: 'Depozit Metal', cost: { metal: 100, crystal: 50 }, buildTime: 60 },
        'crystal-storage': { name: 'Depozit Cristal', cost: { metal: 100, crystal: 50 }, buildTime: 60 },
        'helium-storage': { name: 'Depozit Heliu', cost: { metal: 100, crystal: 50 }, buildTime: 60 },
        'energy-storage': { name: 'Depozit Energie', cost: { metal: 100, crystal: 50 }, buildTime: 60 }
    };

    export function initializeBuildings() {
        console.log('Initializing buildings...');
        const buildingsContainer = document.querySelector('.buildings-container');
        if (!buildingsContainer) {
            console.error('Buildings container not found');
            return;
        }

        buildingsContainer.innerHTML = '';
        const category = document.createElement('div');
        category.className = 'building-category';
        category.innerHTML = '<h2>Clădiri</h2>';
        const container = document.createElement('div');
        container.className = 'category-container';
        category.appendChild(container);

        for (const [id, data] of Object.entries(buildingsData)) {
            const card = document.createElement('div');
            card.className = 'building-card';
            const level = getPlayer().buildings[id]?.level || 0;
            card.innerHTML = `
                <h3>${data.name} (Nivel ${level})</h3>
                <p>Cost: ${data.cost.metal} Metal, ${data.cost.crystal} Cristal</p>
                <p>Timp: ${data.buildTime}s</p>
                <button class="build-button" data-id="${id}">Construiește</button>
            `;
            container.appendChild(card);
        }

        buildingsContainer.appendChild(category);
        updateBuildButtons();
        console.log('Buildings initialized');
    }

    export function refreshBuildingUI(buildingId) {
        console.log('Refreshing UI for building:', buildingId);
        const card = document.querySelector(`.build-button[data-id="${buildingId}"]`)?.closest('.building-card');
        if (card) {
            const level = getPlayer().buildings[buildingId]?.level || 0;
            const data = buildingsData[buildingId];
            card.querySelector('h3').textContent = `${data.name} (Nivel ${level})`;
            updateBuildButtons();
        }
    }

    export function updateBuildButtons() {
        console.log('Updating build buttons...');
        const player = getPlayer();
        document.querySelectorAll('.build-button').forEach(button => {
            const id = button.dataset.id;
            const data = buildingsData[id];
            const canAfford = player.resources.metal >= data.cost.metal && player.resources.crystal >= data.cost.crystal;
            button.disabled = !canAfford || player.activeConstructions >= ((player.buildings['adv-research-center']?.level || 0) + 1);
            button.onclick = async () => {
                if (canAfford) {
                    player.resources.metal -= data.cost.metal;
                    player.resources.crystal -= data.cost.crystal;
                    const added = await addBuildingToQueue(id, data.buildTime);
                    if (added) {
                        showMessage(`Construiești ${data.name}!`, 'success');
                        updateBuildButtons();
                    }
                } else {
                    showMessage('Resurse insuficiente!', 'error');
                }
            };
        });
    }

    document.addEventListener('DOMContentLoaded', initializeBuildings);
} catch (error) {
    console.error('Error in buildings.js:', error);
}
