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

    // Define categories
    const categories = {
        production: {
            name: 'Producție',
            buildings: buildings.filter(b => ['metal_mine', 'crystal_mine', 'helium_refinery'].includes(b.key))
        },
        energy: {
            name: 'Energie',
            buildings: buildings.filter(b => b.key === 'solar_plant')
        },
        military: {
            name: 'Militar',
            buildings: buildings.filter(b => b.key === 'shipyard')
        },
        research: {
            name: 'Cercetare',
            buildings: buildings.filter(b => b.key === 'research_lab')
        }
    };

    // Generate category sections
    Object.values(categories).forEach(category => {
        if (category.buildings.length === 0) return;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'building-category';
        categoryDiv.innerHTML = `<h2>${category.name}</h2>`;
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'category-cards';

        category.buildings.forEach((building, index) => {
            const level = gameState.buildings[building.key] || 0;
            const cost = Object.entries(building.baseCost).reduce((acc, [resource, amount]) => {
                acc[resource] = Math.floor(amount * Math.pow(1.5, level));
                return acc;
            }, {});
            const buildTime = Math.floor(building.baseBuildTime * Math.pow(1.2, level));
            console.log(`Building: ${building.name}, Level: ${level}, Cost: ${JSON.stringify(cost)}, Build Time: ${buildTime}s`);

            const canAfford = Object.entries(cost).every(([resource, amount]) => gameState.resources[resource] >= amount);

            const globalIndex = buildings.findIndex(b => b.key === building.key);
            const card = document.createElement('div');
            card.className = 'building-card';
            card.innerHTML = `
                <img src="${building.image}" alt="${building.name}" class="building-image" onerror="console.error('Failed to load image ${building.image} at index ${globalIndex}')">
                <h3>${building.name} (Nivel ${level})</h3>
                <p>Cost: ${Object.entries(cost).map(([res, amt]) => `${res}: ${amt}`).join(', ')}</p>
                <p>Timp: ${buildTime}s</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-${globalIndex}"></div>
                    <span class="progress-timer" id="timer-${globalIndex}"></span>
                </div>
                <button class="build-button" data-index="${globalIndex}" ${canAfford && !gameState.isBuilding ? '' : 'disabled'}>Construiește</button>
            `;
            cardsContainer.appendChild(card);
            console.log(`Added card for ${building.name} at global index ${globalIndex}`);
        });

        categoryDiv.appendChild(cardsContainer);
        container.appendChild(categoryDiv);
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
            console.log(`Starting construction: ${building.name}, Level: ${level + 1}, Time: ${buildTime}s`);

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
                        console.log(`Completed: ${building.name}, New Level: ${gameState.buildings[building.key]}`);

                        // Update production rates
                        Object.entries(building.production).forEach(([resource, amount]) => {
                            gameState.production[resource] = (gameState.production[resource] || 0) + amount;
                        });

                        gameState.isBuilding = false;
                        showMessage(`${building.name} construită la nivel ${gameState.buildings[building.key]}!`, 'success');
                        updateHUD();
                        initializeBuildings();
                        updateHUD(); // Ensure HUD is updated after rebuild
                    }
                }, 1000);
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        };
    });
}
