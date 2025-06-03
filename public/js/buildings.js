console.log('buildings.js loaded');

function initializeBuildings() {
    console.log('initializeBuildings called');
    const economyList = document.getElementById('economy-buildings');
    const militaryList = document.getElementById('military-buildings');
    const defenseList = document.getElementById('defense-buildings');

    if (!economyList || !militaryList || !defenseList) {
        console.warn('Building lists not found, DOM may not be ready:', {
            economyList: !!economyList,
            militaryList: !!militaryList,
            defenseList: !!defenseList
        });
        setTimeout(initializeBuildings, 100); // Retry after 100ms
        return;
    }

    economyList.innerHTML = '';
    militaryList.innerHTML = '';
    defenseList.innerHTML = '';
    console.log('Cleared building lists');

    const categories = {
        economy: ['metal_mine', 'crystal_mine', 'helium_refinery', 'solar_plant'],
        military: ['shipyard', 'research_lab'],
        defense: ['defense_turret', 'orbital_station']
    };

    gameState.buildings = gameState.buildings || {};

    gameState.buildingsList.forEach(building => {
        console.log(`Processing building: ${building.name}`);
        const card = document.createElement('div');
        card.className = 'building-card';
        card.id = `building-${building.key}`;
        const level = gameState.buildings[building.key] || 0;
        const cost = calculateBuildingCost(building, level);
        const buildTime = calculateBuildTime(building, level);
        card.innerHTML = `
            <h3>${building.name} (Nivel: ${level})</h3>
            <p>Cost:</p>
            <p>Metal: ${Math.round(cost.metal)}, Cristal: ${Math.round(cost.crystal)}</p>
            <p>Timp: ${Math.round(buildTime)}s</p>
            <button class="sf-button" id="build-btn-${building.key}" ${gameState.isBuilding ? 'disabled' : ''}>Construiește</button>
            <div class="progress-bar" id="progress-${building.key}" style="display: none;">
                <div class="progress-fill" id="fill-${building.key}"></div>
                <span class="progress-text" id="text-${building.key}">0%</span>
            </div>
        `;
        if (categories.economy.includes(building.key)) {
            economyList.appendChild(card);
        } else if (categories.military.includes(building.key)) {
            militaryList.appendChild(card);
        } else if (categories.defense.includes(building.key)) {
            defenseList.appendChild(card);
        }
        console.log(`Added card for ${building.name}`);

        const button = document.getElementById(`build-btn-${building.key}`);
        if (button) {
            button.addEventListener('click', () => startBuilding(building.key));
        } else {
            console.error(`Button for ${building.name} not found`);
        }
    });
}

function calculateBuildingCost(building, level) {
    const cost = {};
    Object.keys(building.cost).forEach(resource => {
        cost[resource] = building.cost[resource] * Math.pow(1.5, level);
    });
    return cost;
}

function calculateBuildTime(building, level) {
    return building.time * Math.pow(1.3, level);
}

function startBuilding(key) {
    console.log(`Attempting to build ${key}`);
    const building = gameState.buildingsList.find(b => b.key === key);
    if (!building) {
        console.error(`Building not found: ${key}`);
        showMessage('Eroare: Clădirea nu a fost găsită!', 'error');
        return;
    }

    const level = gameState.buildings[key] || 0;
    const cost = calculateBuildingCost(building, level);
    const buildTime = calculateBuildTime(building, level);
    const hasResources = gameState.resources.metal >= cost.metal && gameState.resources.crystal >= cost.crystal;

    if (hasResources && !gameState.isBuilding) {
        gameState.isBuilding = true;
        gameState.resources.metal -= cost.metal;
        gameState.resources.crystal -= cost.crystal;
        console.log(`Building ${building.name} level ${level + 1}, cost deducted:`, cost);

        const progressBar = document.getElementById(`progress-${key}`);
        const progressFill = document.getElementById(`fill-${key}`);
        const progressText = document.getElementById(`text-${key}`);
        const buildButton = document.getElementById(`build-btn-${key}`);

        if (progressBar && progressFill && progressText && buildButton) {
            progressBar.style.display = 'block';
            buildButton.disabled = true;
            document.querySelectorAll('.sf-button').forEach(btn => btn.disabled = true);
            let progress = 0;
            const intervalTime = (buildTime * 1000) / 100;
            const interval = setInterval(() => {
                progress += 1;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${Math.floor(progress)}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, intervalTime);

            setTimeout(() => {
                gameState.buildings[key] = level + 1;
                gameState.isBuilding = false;
                progressBar.style.display = 'none';
                buildButton.disabled = false;
                document.querySelectorAll('.sf-button').forEach(btn => btn.disabled = false);
                updateHUD();
                saveGame();
                initializeBuildings();
                showMessage(`Clădire ${building.name} nivel ${level + 1} finalizată!`, 'success');
                console.log(`Building ${building.name} level ${level + 1} completed, production:`, building.production);
            }, buildTime * 1000);
            updateHUD();
            saveGame();
        } else {
            console.error(`Progress elements for ${building.name} not found`);
            gameState.isBuilding = false;
            showMessage('Eroare: Elementele de progres nu au fost găsite!', 'error');
        }
    } else {
        showMessage(`Resurse insuficiente sau construcție în curs pentru ${building.name}!`, 'error');
        console.warn(`Cannot build ${building.name}, cost:`, cost, 'available:', gameState.resources, 'isBuilding:', gameState.isBuilding);
    }
}
