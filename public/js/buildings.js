console.log('buildings.js loaded');

function initializeBuildings() {
    console.log('initializeBuildings called');
    const buildingsList = document.getElementById('buildings-list');
    if (!buildingsList) {
        console.error('Buildings list #buildings-list not found');
        return;
    }

    buildingsList.innerHTML = '';
    gameState.buildings = [];
    console.log('Cleared buildings list');

    gameState.buildingsList.forEach(building => {
        const card = document.createElement('div');
        card.className = 'building-card';
        const level = gameState.buildings[building.key] || 0';
        card.innerHTML = `
            <img src="${building.image}" alt="${building.name}">
            <h3>${building.name} (Nivel: ${level})</h3>
            <p>Cost: </p>
            <p>Metal: ${building.baseCost.metal}, Cristal: ${building.baseCost.crystal}</p>
            <p>Timp: ${building.baseBuildTime}s</p>
            <button class="sf-button" onclick="buildBuilding('${building.key}')">Construiește</button>
        buildingsList.appendChild(card);
        console.log('Added card for ${building.name}');
    });
}

function buildBuilding(key) {
    console.log('Attempting to build ${key}');
    const building = gameState.buildingsList.find(b => b.key === key);
    if (!building) {
        console.error('Building not found: ${key}');
        return;
    }

    const cost = building.baseCost;
    if (gameState.resources.metal >= cost.metal && gameState.resources.crystal >= cost.crystal) {
        gameState.resources.metal -= cost.metal;
        gameState.resources.crystal -= cost.crystal;
        gameState.isBuilding = true;
        console.log('Building ${building.name}, cost deducted:', cost);

        setTimeout(() => {
            gameState.buildings[key] = (gameState.buildings[key] || 0) + 1;
            Object.keys(building.production).forEach(resource => {
                gameState.production[resource] += building.production[resource];
            });
            gameState.isBuilding = false;
            updateHUD();
            saveGame();
            initializeBuildings();
            showMessage('Building ${building.name} completed!', 'success');
            console.log('Building ${building.name} completed, production updated:', gameState.production);
        }, building.baseBuildTime * 1000);
    } else {
        showMessage('Resurse insuficiente pentru a construi ${building.name}!', 'error');
        console.warn('Insufficient resources for ${building.name}, cost:', cost, available:', gameState.resources);
    }
}
