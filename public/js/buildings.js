console.log('buildings.js loaded');

function initializeBuildings() {
    console.log('initializeBuildings called');
    const container = document.querySelector('.buildings-container');
    if (!container) {
        console.error('Buildings container not found');
        return;
    }
    container.innerHTML = '';
    console.log('Cleared buildings container');

    const buildings = gameState.buildingsList;
    console.log('Buildings array:', buildings);

    buildings.forEach((building, index) => {
        const level = gameState.buildings[building.key] || 0;
        const cost = Object.entries(building.baseCost).reduce((acc, [resource, amount]) => {
            acc[resource] = Math.floor(amount * Math.pow(1.5, level));
            return acc;
        }, {});
        const buildTime = Math.floor(building.baseBuildTime * Math.pow(1.2, level));
        const canAfford = Object.entries(cost).every(([resource, amount]) => gameState.resources[resource] >= amount);

        const card = document.createElement('div');
        card.className = 'building-card';
        card.innerHTML = `
            <img src="${building.image}" alt="${building.name}" class="building-image" onerror="console.error('Failed to load image ${building.image} at index ${index}')">
            <h3>${building.name} (Nivel ${level})</h3>
            <p>Cost: ${Object.entries(cost).map(([res, amt]) => `${res}: ${amt}`).join(', ')}</p>
            <p>Timp: ${buildTime}s</p>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progress-${index}"></div>
                <span class="progress-timer" id="timer-${index}"></span>
            </div>
            <button class="build-button" data-index="${index}" ${canAfford && !gameState.isBuilding ? '' : 'disabled'}>Construiește</button>
        `;
        container.appendChild(card);
        console.log(`Added card for ${building.name} at index ${index}`);
    });

    document.querySelectorAll('.build-button').forEach(button => {
        button.onclick = () => {
            if (gameState.isBuilding) {
                showMessage('O clădire este deja în construcție!', 'error');
                return;
            }

            const index = parseInt(button.dataset.index);
            const building = buildings[index];
            const level = gameState.buildings[building.key] || 0;
            const cost = Object.entries(building.baseCost).reduce((acc, [resource, amount]) => {
                acc[resource] = Math.floor(amount * Math.pow(1.5, level));
                return acc;
            }, {});
            const buildTime = Math.floor(building.baseBuildTime * Math.pow(1.2, level));

            if (Object.entries(cost).every(([resource, amount]) => gameState.resources[resource] >= amount)) {
                Object.entries(cost).forEach(([resource, amount]) => {
                    gameState.resources[resource] -= amount;
                });

                gameState.isBuilding = true;
                document.querySelectorAll('.build-button').forEach(btn => btn.disabled = true);

                const progressBar = document.getElementById(`progress-${index}`);
                const timer = document.getElementById(`timer-${index}`);
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
                        gameState.buildings[building.key] = (gameState.buildings[building.key] || 0) + 1;

                        // Update production rates
                        Object.entries(building.production).forEach(([resource, amount]) => {
                            gameState.production[resource] = (gameState.production[resource] || 0) + amount;
                        });

                        gameState.isBuilding = false;
                        showMessage(`${building.name} construită la nivel ${gameState.buildings[building.key]}!`, 'success');
                        updateHUD();
                        initializeBuildings();
                    }
                }, 1000);
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        };
    });
}
