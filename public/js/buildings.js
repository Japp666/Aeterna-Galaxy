console.log('buildings.js loaded');

function initializeBuildings() {
    console.log('initializeBuildings called');
    const buildingsList = document.getElementById('buildings-list');
    if (!buildingsList) {
        console.error('Buildings list #buildings-list not found');
        return;
    }

    buildingsList.innerHTML = '';
    gameState.buildings = gameState.buildings || {};
    console.log('Cleared buildings list');

    gameState.buildingsList.forEach(building => {
        const card = document.createElement('div');
        card.className = 'building-card';
        const level = gameState.buildings[building.key] || 0;
        card.innerHTML = `
            <img src="${building.image}" alt="${building.name}">
            <h3>${building.name} (Nivel: ${level})</h3>
            <p>Cost: </p>
            <p>Metal: ${building.baseCost.metal}, Cristal: ${building.baseCost.crystal || 0}</p>
            <p>Timp: ${building.baseBuildTime}s</p>
            <button class="sf-button" onclick="buildBuilding('${building.key}')">Construiește</button>
        `;
        buildingsList.appendChild(card);
        console.log(`Added card for ${building.name}`);
    });
}

function buildBuilding(key) {
    console.log(`Attempting to build ${key}`);
    const building = gameState.buildingsList.find(b => b.key === key);
    if (!building) {
        console.error(`Building not found: ${key}`);
        return;
    }

    const cost = building.baseCost;
    const hasResources = gameState.resources.metal >= cost.metal && (!cost.crystal || gameState.resources.crystal >= cost.crystal);
    if (hasResources && !gameState.isBuilding) {
        gameState.resources.metal -= cost.metal;
        if (cost.crystal) gameState.resources.crystal -= cost.crystal;
        gameState.isBuilding = true;
        console.log(`Building ${building.name}, cost deducted:`, cost);

        setTimeout(() => {
            gameState.buildings[key] = (gameState.buildings[key] || 0) + 1;
            Object.keys(building.production || {}).forEach(resource => {
                gameState.production[resource] = (gameState.production[resource] || 0) + building.production[resource];
            });
            gameState.isBuilding = false;
            updateHUD();
            saveGame();
            initializeBuildings();
            showMessage(`Building ${building.name} completed!`, 'success');
            console.log(`Building ${building.name} completed, production:`, gameState.production);
        }, building.baseBuildTime * 1000);
        updateHUD();
        saveGame();
    } else {
        showMessage(`Resurse insuficiente sau construcție în curs pentru ${building.name}!`, 'error');
        console.warn(`Cannot build ${building.name}, cost:`, cost, 'available:', gameState.resources, 'isBuilding:', gameState.isBuilding);
    }
}
