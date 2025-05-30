console.log('buildings.js loaded');

function initializeBuildings() {
    console.log('initializeBuildings called');
    const container = document.querySelector('.buildings-container');
    if (!container) {
        console.error('Buildings container not found');
        return;
    }
    container.innerHTML = '';

    const categories = {
        production: { name: 'Producție', buildings: gameState.buildingsList.filter(b => ['metal_mine', 'crystal_mine', 'helium_refinery'].includes(b.key)) },
        energy: { name: 'Energie', buildings: gameState.buildingsList.filter(b => b.key === 'solar_plant') },
        military: { name: 'Militar', buildings: gameState.buildingsList.filter(b => ['shipyard', 'defense_turret'].includes(b.key)) },
        exploration: { name: 'Explorare', buildings: gameState.buildingsList.filter(b => b.key === 'orbital_station') }
    };

    Object.values(categories).forEach(category => {
        if (!category.buildings.length) return;
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'building-category';
        categoryDiv.innerHTML = `<h2>${category.name}</h2>`;
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'category-cards';

        category.buildings.forEach((building) => {
            const level = gameState.buildings[building.key] || 0;
            const cost = Object.entries(building.baseCost).reduce((acc, [res, amt]) => {
                acc[res] = Math.floor(amt * Math.pow(1.5, level));
                return acc;
            }, {});
            const buildTime = Math.floor(building.baseBuildTime * Math.pow(1.2, level));
            const canAfford = Object.entries(cost).every(([res, amt]) => gameState.resources[res] >= amt);

            const card = document.createElement('div');
            card.className = 'building-card';
            card.innerHTML = `
                <img src="${building.image}" alt="${building.name}" class="building-image">
                <h3>${building.name} (Nivel ${level})</h3>
                <p>Cost: ${Object.entries(cost).map(([r, a]) => `${r}: ${a}`).join(', ')}</p>
                <p>Timp: ${buildTime}s</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-${building.key}"></div>
                    <span class="progress-timer" id="timer-${building.key}"></span>
                </div>
                <button class="build-button" data-key="${building.key}" ${canAfford && !gameState.isBuilding ? '' : 'disabled'}>Construiește</button>
            `;
            cardsContainer.appendChild(card);
        });

        categoryDiv.appendChild(cardsContainer);
        container.appendChild(categoryDiv);
    });

    document.querySelectorAll('.build-button').forEach(button => {
        button.onclick = () => {
            if (gameState.isBuilding) {
                showMessage('O clădire este în construcție!', 'error');
                return;
            }

            const key = button.dataset.key;
            const building = gameState.buildingsList.find(b => b.key === key);
            const level = gameState.buildings[key] || 0;
            const cost = Object.entries(building.baseCost).reduce((acc, [res, amt]) => {
                acc[res] = Math.floor(amt * Math.pow(1.5, level));
                return acc;
            }, {});
            const buildTime = Math.floor(building.baseBuildTime * Math.pow(1.2, level));

            if (Object.entries(cost).every(([res, amt]) => gameState.resources[res] >= amt)) {
                Object.entries(cost).forEach(([res, amt]) => gameState.resources[res] -= amt);
                gameState.isBuilding = true;
                document.querySelectorAll('.build-button').forEach(btn => btn.disabled = true);

                const progressBar = document.getElementById(`progress-${key}`);
                const timer = document.getElementById(`timer-${key}`);
                let timeLeft = buildTime;
                progressBar.style.width = '0%';
                timer.textContent = `${timeLeft}s`;

                const interval = setInterval(() => {
                    timeLeft--;
                    const progress = ((buildTime - timeLeft) / buildTime) * 100;
                    progressBar.style.width = `${progress}%`;
                    timer.textContent = `${Math.floor(progress)}%`;

                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        gameState.buildings[key] = (gameState.buildings[key] || 0) + 1;
                        Object.entries(building.production).forEach(([res, amt]) => {
                            gameState.production[res] = (gameState.production[res] || 0) + (amt * (gameState.raceBonus[res] || 1));
                        });
                        gameState.isBuilding = false;
                        showMessage(`${building.name} construită la nivel ${gameState.buildings[key]}!`, 'success');
                        initializeBuildings();
                        updateHUD();
                    }
                }, 1000);
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        };
    });
}
