console.log('buildings.js loaded successfully');

try {
    const buildingsData = {
        'metal-mine': { name: 'Mină de Metal', cost: { metal: 100, crystal: 50 }, buildTime: 60, image: 'images/buildings/metal-mine.png' },
        'crystal-mine': { name: 'Mină de Cristal', cost: { metal: 120, crystal: 60 }, buildTime: 80, image: 'images/buildings/crystal-mine.png' },
        'helium-mine': { name: 'Mină de Heliu', cost: { metal: 150, crystal: 80 }, buildTime: 100, image: 'images/buildings/helium-mine.png' },
        'power-plant': { name: 'Centrală Energetică', cost: { metal: 200, crystal: 100 }, buildTime: 120, image: 'images/buildings/power-plant.png' },
        'metal-storage': { name: 'Depozit Metal', cost: { metal: 100, crystal: 50 }, buildTime: 60, image: 'images/buildings/metal-storage.png' },
        'crystal-storage': { name: 'Depozit Cristal', cost: { metal: 100, crystal: 50 }, buildTime: 60, image: 'images/buildings/crystal-storage.png' },
        'helium-storage': { name: 'Depozit Heliu', cost: { metal: 100, crystal: 50 }, buildTime: 60, image: 'images/buildings/helium-storage.png' },
        'energy-storage': { name: 'Depozit Energie', cost: { metal: 100, crystal: 50 }, buildTime: 60, image: 'images/buildings/energy-storage.png' }
    };

    function initializeBuildings() {
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

        const player = window.getPlayer ? window.getPlayer() : { buildings: {}, resources: { metal: 1000, crystal: 500 }, activeConstructions: 0 };

        for (const [id, data] of Object.entries(buildingsData)) {
            const card = document.createElement('div');
            card.className = 'building-card';
            const level = player.buildings[id] ? player.buildings[id].level : 0;
            card.innerHTML = `
                <img src="${data.image}" alt="${data.name}" class="building-image" style="width:100%; height:auto; border-radius:4px;">
                <h3>${data.name} (Nivel ${level})</h3>
                <p>Cost: ${data.cost.metal} Metal, ${data.cost.crystal} Cristal</p>
                <p>Timp: ${data.buildTime}s</p>
                <button class="build-button" data-id="${id}">Construiește</button>
                <div class="progress-bar-container" style="display:none;">
                    <div class="progress-bar"></div>
                    <p class="progress-timer">0s</p>
                </div>
            `;
            container.appendChild(card);
        }

        buildingsContainer.appendChild(category);
        updateBuildButtons();
        console.log('Buildings initialized');
    }

    function refreshBuildingUI(buildingId) {
        console.log('Refreshing UI for building:', buildingId);
        const card = document.querySelector(`.build-button[data-id="${buildingId}"]`)?.closest('.building-card');
        if (card) {
            const player = window.getPlayer ? window.getPlayer() : { buildings: {} };
            const level = player.buildings[buildingId] ? player.buildings[buildingId].level : 0;
            const data = buildingsData[buildingId];
            card.querySelector('h3').textContent = `${data.name} (Nivel ${level})`;
            updateBuildButtons();
        }
    }

    function updateBuildButtons() {
        console.log('Updating build buttons...');
        const player = window.getPlayer ? window.getPlayer() : { buildings: {}, resources: { metal: 1000, crystal: 500 }, activeConstructions: 0 };
        document.querySelectorAll('.build-button').forEach(button => {
            const id = button.dataset.id;
            const data = buildingsData[id];
            if (data) {
                const canAfford = player.resources.metal >= data.cost.metal && player.resources.crystal >= data.cost.crystal;
                button.disabled = !canAfford || player.activeConstructions >= ((player.buildings['adv-research-center'] ? player.buildings['adv-research-center'].level : 0) + 1);
                button.onclick = async () => {
                    if (canAfford) {
                        player.resources.metal -= data.cost.metal;
                        player.resources.crystal -= data.cost.crystal;
                        const added = window.addBuildingToQueue ? await window.addBuildingToQueue(id, data.buildTime) : true;
                        if (added) {
                            window.showMessage(`Construiești ${data.name}!`, 'success');
                            startConstructionProgress(button.closest('.building-card'), data.buildTime);
                            updateBuildButtons();
                        }
                    } else {
                        window.showMessage('Resurse insuficiente!', 'error');
                    }
                };
            }
        });
    }

    function startConstructionProgress(card, buildTime) {
        const progressContainer = card.querySelector('.progress-bar-container');
        const progressBar = card.querySelector('.progress-bar');
        const timerText = card.querySelector('.progress-timer');
        progressContainer.style.display = 'block';
        let timeLeft = buildTime;
        const interval = setInterval(() => {
            timeLeft--;
            timerText.textContent = `${timeLeft}s`;
            progressBar.style.width = `${(1 - timeLeft / buildTime) * 100}%`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                progressContainer.style.display = 'none';
            }
        }, 1000);
    }

    document.addEventListener('DOMContentLoaded', initializeBuildings);
    window.initializeBuildings = initializeBuildings;
    window.refreshBuildingUI = refreshBuildingUI;
    window.updateBuildButtons = updateBuildButtons;
} catch (error) {
    console.error('Error in buildings.js:', error);
}
