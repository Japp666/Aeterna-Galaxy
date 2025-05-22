import { getPlayer, addBuildingToQueue } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

const buildingsData = {
    'power_plant': {
        id: 'power_plant',
        name: 'Centrală Energetică',
        description: 'Produce energie pentru colonie.',
        image: 'https://i.imgur.com/example-power-plant.png',
        cost: { metal: 50, crystal: 20, helium: 0, energy: 0 },
        buildTime: 5
    },
    'metal_mine': {
        id: 'metal_mine',
        name: 'Mină de Metal',
        description: 'Extrage metal din sol.',
        image: 'https://i.imgur.com/example-mineral-mine.png',
        cost: { metal: 30, crystal: 10, helium: 0, energy: 10 },
        buildTime: 4
    },
    'crystal_extractor': {
        id: 'crystal_extractor',
        name: 'Extractor de Cristal',
        description: 'Colectează cristale rare.',
        image: 'https://i.imgur.com/example-crystal.png',
        cost: { metal: 40, crystal: 0, helium: 0, energy: 15 },
        buildTime: 6
    },
    'helium_synthesizer': {
        id: 'helium_synthesizer',
        name: 'Sintetizator Heliu-2025',
        description: 'Producție avansată de heliu pentru tehnologie.',
        image: 'https://i.imgur.com/example-helium.png',
        cost: { metal: 60, crystal: 30, helium: 0, energy: 20 },
        buildTime: 8
    }
};

export function initBuildingsPage() {
    const player = getPlayer();
    const container = document.querySelector('.buildings-container');
    if (!container) return;

    let list = container.querySelector('.building-list');
    if (!list) {
        list = document.createElement('div');
        list.className = 'building-list';
        container.appendChild(list);
    }

    list.innerHTML = '';

    Object.values(buildingsData).forEach(building => {
        const card = document.createElement('div');
        card.className = 'building-card';
        card.innerHTML = `
            <img src="${building.image}" class="card-image" alt="${building.name}">
            <h3 class="card-title">${building.name}</h3>
            <p class="card-description">${building.description}</p>
            <p>Cost: Metal: ${building.cost.metal}, Cristal: ${building.cost.crystal}, Heliu: ${building.cost.helium}, Energie: ${building.cost.energy}</p>
            <p>Timp: ${building.buildTime}s</p>
            <button class="build-button" data-building-id="${building.id}">Construiește</button>
            <div class="progress-bar-container" style="display:none;">
                <div class="progress-bar" style="width: 0%;"><span class="progress-text"></span></div>
            </div>
        `;
        list.appendChild(card);
    });

    list.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.buildingId;
            const b = buildingsData[id];
            if (!b) return;

            const hasAllResources = Object.entries(b.cost).every(([res, val]) => player.resources[res] >= val);
            if (!hasAllResources) {
                showMessage(`Resurse insuficiente pentru ${b.name}`, 'error');
                return;
            }

            // Scade resursele
            for (const [res, val] of Object.entries(b.cost)) {
                player.resources[res] -= val;
            }

            updateHUD();
            addBuildingToQueue(id, b.buildTime);
            showMessage(`Construiești ${b.name}...`, 'success');

            // Progress bar
            e.target.disabled = true;
            const barContainer = e.target.nextElementSibling;
            const bar = barContainer.querySelector('.progress-bar');
            const text = bar.querySelector('.progress-text');
            barContainer.style.display = 'block';

            let timeLeft = b.buildTime;
            const interval = setInterval(() => {
                timeLeft--;
                const percent = ((b.buildTime - timeLeft) / b.buildTime) * 100;
                bar.style.width = `${percent}%`;
                text.textContent = `${Math.max(0, timeLeft)}s`;

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    bar.style.width = '100%';
                    text.textContent = 'Finalizat!';
                    showMessage(`${b.name} a fost construită!`, 'success');
                }
            }, 1000);
        });
    });
}
