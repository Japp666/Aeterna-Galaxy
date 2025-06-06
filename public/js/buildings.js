console.log('buildings.js loaded');

function initializeBuildings() {
    const buildingGrid = document.getElementById('building-grid');
    if (!buildingGrid) {
        console.error('Building grid container not found');
        return;
    }

    const categories = {
        'Producție': ['metal_mine', 'crystal_mine', 'helium_refinery', 'solar_plant'],
        'Infrastructură': ['shipyard', 'research_lab'],
        'Apărare': ['defense_turret', 'orbital_station']
    };

    let html = '';
    for (const [category, keys] of Object.entries(categories)) {
        html += `<div class="building-category"><h2>${category}</h2><div class="building-grid">`;
        keys.forEach(key => {
            const building = gameState.buildingsList.find(b => b.key === key);
            if (building) {
                const level = gameState.buildings[building.key]?.level || 0;
                const cost = Object.entries(building.baseCost)
                    .map(([res, amt]) => `${res}: ${Math.floor(amt * Math.pow(1.5, level))}`)
                    .join(', ');
                html += `
                    <div class="building-card" data-building="${building.key}">
                        <img src="${building.image}" alt="${building.name}">
                        <h3>${building.name} (Nivel ${level})</h3>
                        <p>Cost: ${cost}</p>
                        <p>Timp: ${Math.floor(building.baseBuildTime * Math.pow(1.2, level))}s</p>
                        <button class="sf-button" onclick="build('${building.key}')">Construiește</button>
                    </div>
                `;
            }
        });
        html += `</div></div>`;
    }
    buildingGrid.innerHTML = html;
    console.log('Buildings initialized:', html);
}

function build(buildingKey) {
    const building = gameState.buildingsList.find(b => b.key === buildingKey);
    if (!building) return;

    const level = gameState.buildings[building.key]?.level || 0;
    const cost = Object.fromEntries(
        Object.entries(building.baseCost).map(([res, amt]) => [res, Math.floor(amt * Math.pow(1.5, level))])
    );

    if (!canAfford(cost)) {
        showMessage('Resurse insuficiente!', 'error');
        return;
    }
    if (gameState.isBuilding) {
        showMessage('O altă construcție este în curs!', 'error');
        return;
    }

    gameState.isBuilding = true;
    gameState.currentBuilding = buildingKey;
    gameState.buildStartTime = Date.now();
    deductResources(cost);
    saveGame();

    const buildTime = building.baseBuildTime * Math.pow(1.2, level) * 1000;
    setTimeout(() => {
        gameState.buildings[buildingKey] = gameState.buildings[buildingKey] || { level: 0 };
        gameState.buildings[buildingKey].level += 1;
        Object.entries(building.production || {}).forEach(([res, amt]) => {
            gameState.production[res] = (gameState.production[res] || 0) + amt;
        });
        gameState.isBuilding = false;
        gameState.currentBuilding = null;
        gameState.buildStartTime = null;
        saveGame();
        initializeBuildings();
        updateHUD();
        showMessage(`${building.name} construit!`, 'success');
    }, buildTime);
}
