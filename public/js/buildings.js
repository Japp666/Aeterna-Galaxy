console.log('buildings.js loaded');

function initializeBuildings() {
    console.log('initializeBuildings called');
    const productionList = document.getElementById('production-buildings');
    const infrastructureList = document.getElementById('infrastructure-buildings');
    const militaryList = document.getElementById('military-buildings');
    
    if (!productionList || !infrastructureList || !militaryList) {
        console.error('Building lists not found');
        return;
    }

    productionList.innerHTML = '';
    infrastructureList.innerHTML = '';
    militaryList.innerHTML = '';
    gameState.buildings = gameState.buildings || {};
    console.log('Cleared building lists');

    const categories = {
        production: ['metal_mine', 'crystal_mine', 'helium_refinery', 'solar_plant'],
        infrastructure: ['shipyard', 'research_lab', 'orbital_station'],
        military: ['defense_turret']
    };

    gameState.buildingsList.forEach(building => {
        const card = document.createElement('div');
        card.className = 'building-card';
        card.id = `building-${building.key}`;
        const level = gameState.buildings[building.key] || 0;
        card.innerHTML = `
            <img src="${building.image}" alt="${building.name}">
            <h3>${building.name} (Nivel: ${level})</h3>
            <p>Cost:</p>
            <p>Metal: ${building.baseCost.metal}, Cristal: ${building.baseCost.crystal || 0}${building.baseCost.helium ? ', Heliu: ' + building.baseCost.helium : ''}</p>
            <p>Timp: ${building.baseBuildTime}s</p>
            <button class="sf-button" id="build-${building.key}">Construiește</button>
            <div class="progress-bar" id="progress-${building.key}" style="display: none;">
                <div class="progress-fill" id="fill-${building.key}"></div>
                <span class="progress-text" id="text-${building.key}">0%</span>
            </div>
        `;
        if (categories.production.includes(building.key)) {
            productionList.appendChild(card);
        } else if (categories.infrastructure.includes(building.key)) {
            infrastructureList.appendChild(card);
        } else if (categories.military.includes(building.key)) {
            militaryList.appendChild(card);
        }
        console.log(`Added card for ${building.name}`);

        document.getElementById(`build-${building.key}`).addEventListener('click', () => buildBuilding(building.key));
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
    const hasResources = gameState.resources.metal >= cost.metal &&
                         (!cost.crystal || gameState.resources.crystal >= cost.crystal) &&
                         (!cost.helium || gameState.resources.helium >= cost.helium);
    
    if (hasResources && !gameState.isBuilding) {
        gameState.isBuilding = true;
        gameState.resources.metal -= cost.metal;
        if (cost.crystal) gameState.resources.crystal -= cost.crystal;
        if (cost.helium) gameState.resources.helium -= cost.helium;
        console.log(`Building ${building.name}, cost deducted:`, cost);

        const progressBar = document.getElementById(`progress-${key}`);
        const progressFill = document.getElementById(`fill-${key}`);
        const progressText = document.getElementById(`text-${key}`);
        const buildButton = document.getElementById(`build-${key}`);
        
        progressBar.style.display = 'block';
        buildButton.disabled = true;
        let progress = 0;
        const interval = setInterval(() => {
            progress += 100 / (building.baseBuildTime * 10);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);

        setTimeout(() => {
            gameState.buildings[key] = (gameState.buildings[key] || 0) + 1;
            Object.keys(building.production || {}).forEach(resource => {
                gameState.production[resource] = (gameState.production[resource] || 0) + building.production[resource];
            });
            gameState.isBuilding = false;
            progressBar.style.display = 'none';
            buildButton.disabled = false;
            updateHUD();
            saveGame();
            initializeBuildings();
            showMessage(`Construcție ${building.name} finalizată!`, 'success');
            console.log(`Building ${building.name} completed, production:`, gameState.production);
        }, building.baseBuildTime * 1000);
        updateHUD();
        saveGame();
    } else {
        showMessage(`Resurse insuficiente sau construcție în curs pentru ${building.name}!`, 'error');
        console.warn(`Cannot build ${building.name}, cost:`, cost, 'available:', gameState.resources, 'isBuilding:', gameState.isBuilding);
    }
}
