console.log('utils.js loaded');

const gameState = {
    player: { nickname: '', race: '', coords: { x: 0, y: 0 } },
    resources: { metal: 5000, crystal: 5000, helium: 2500, energy: 2500, research: 500 },
    production: { metal: 0, crystal: 0, helium: 0, energy: 0, research: 0 },
    buildings: {},
    buildingsList: [
        { key: 'metal_mine', name: 'Mina de Metal', baseCost: { metal: 600, crystal: 150 }, baseBuildTime: 10, production: { metal: 500 }, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'crystal_mine', name: 'Mina de Cristal', baseCost: { metal: 480, crystal: 240 }, baseBuildTime: 15, production: { crystal: 300 }, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'helium_refinery', name: 'Rafinărie de Heliu', baseCost: { metal: 1000, crystal: 400, helium: 200 }, baseBuildTime: 20, production: { helium: 200 }, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'solar_plant', name: 'Centrală Solară', baseCost: { metal: 750, crystal: 300 }, baseBuildTime: 12, production: { energy: 400 }, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'shipyard', name: 'Șantier Naval', baseCost: { metal: 2000, crystal: 1000, helium: 500 }, baseBuildTime: 30, production: {}, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'research_lab', name: 'Laborator de Cercetare', baseCost: { metal: 1500, crystal: 800, helium: 300 }, baseBuildTime: 25, production: { research: 100 }, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'defense_turret', name: 'Turn de Apărare', baseCost: { metal: 1200, crystal: 500 }, baseBuildTime: 20, production: {}, hp: 100, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' },
        { key: 'orbital_station', name: 'Stație Orbitală', baseCost: { metal: 3000, crystal: 1500 }, baseBuildTime: 40, production: {}, image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' }
    ],
    researches: {},
    researchesList: [
        { key: 'advanced_mining', name: 'Minare Avansată', cost: { research: 100, metal: 200, crystal: 100 }, time: 30, effect: { metal: 1.1, crystal: 1.1 } },
        { key: 'helium_refining', name: 'Rafinare Heliu', cost: { research: 150, metal: 300, crystal: 150 }, time: 40, effect: { helium: 1.15 } },
        { key: 'fusion_energy', name: 'Energie Fuzionară', cost: { research: 200, metal: 400, crystal: 200 }, time: 50, effect: { energyConsumption: 0.8 } },
        { key: 'ionic_propulsion', name: 'Propulsie Ionică', cost: { research: 300, metal: 600, crystal: 300 }, time: 60, effect: { shipSpeed: 1.2 } },
        { key: 'nanotech_armor', name: 'Armură Nanoteh', cost: { research: 250, metal: 500, crystal: 250 }, time: 55, effect: { hp: 1.15 } },
        { key: 'galactic_exploration', name: 'Explorare Galactică', cost: { research: 400, metal: 800, crystal: 400 }, time: 80, effect: { exploration: true } }
    ],
    fleet: [],
    fleetList: [
        { key: 'hunter', name: 'Vânător', cost: { metal: 1000, crystal: 500, helium: 200 }, time: 20, attack: 50, hp: 100, speed: 10 },
        { key: 'cruiser', name: 'Crucișător', cost: { metal: 2000, crystal: 1000, helium: 500 }, time: 30, attack: 100, hp: 200, speed: 8 },
        { key: 'dreadnought', name: 'Dreadnought', cost: { metal: 4000, crystal: 2000, helium: 1000 }, time: 50, attack: 200, hp: 500, speed: 5 }
    ],
    isBuilding: false,
    isResearching: false,
    isBuildingShip: false,
    raceBonus: {},
    players: [],
    currentBuilding: null,
    buildStartTime: null // Track build start time
};

async function loadComponent(component, targetId = 'content') {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) {
        console.error(`Target div #${targetId} not found`);
        return;
    }
    try {
        console.log(`Fetching components/${component}.html`);
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${component}.html`);
        const text = await response.text();
        targetDiv.innerHTML = text;
        console.log(`Loaded ${component}.html into #${targetId}`);
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error.message);
        showMessage(`Eroare la încărcarea ${component}!`, 'error');
    }
}

function showMessage(message, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${type}`;
    msgDiv.textContent = message;
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '100px';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translateX(-50%)';
    msgDiv.style.background = type === 'error' ? '#8B0000' : '#006400';
    msgDiv.style.color = '#B0B0B0';
    msgDiv.style.padding = '10px';
    msgDiv.style.borderRadius = '5px';
    msgDiv.style.zIndex = '1001';
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
}

function saveGame() {
    try {
        localStorage.setItem('galaxiaAeterna', JSON.stringify(gameState));
        console.log('Game saved');
    } catch (error) {
        console.error('Error saving game:', error);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('galaxiaAeterna');
        if (saved) {
            const loadedState = JSON.parse(saved);
            Object.assign(gameState, loadedState);
            if (gameState.isBuilding) {
                console.log('Resetting stuck isBuilding state');
                gameState.isBuilding = false;
                gameState.currentBuilding = null;
                gameState.buildStartTime = null;
            }
            if (gameState.isResearching) {
                console.log('Resetting stuck isResearching state');
                gameState.isResearching = false;
            }
            console.log('Game loaded from localStorage:', gameState);
        }
    } catch (error) {
        console.error('Error loading game:', error);
    }
}

function resetGame() {
    localStorage.removeItem('galaxiaAeterna');
    console.log('Game reset');
    window.location.reload();
}

function updateResources() {
    console.log('updateResources called, current production:', gameState.production);
    let hasChanged = false;
    Object.keys(gameState.production).forEach(resource => {
        const production = gameState.production[resource] || 0;
        if (production > 0) {
            const bonus = gameState.raceBonus[resource] || 1;
            const increment = (production * bonus * 30) / 3600; // 30s update
            const newValue = gameState.resources[resource] + increment;
            const max = resource === 'research' ? Infinity : { metal: 100000, crystal: 100000, helium: 50000, energy: 50000 }[resource];
            gameState.resources[resource] = Math.min(newValue, max);
            hasChanged = true;
            console.log(`Updated ${resource}: +${increment.toFixed(2)}, new value: ${gameState.resources[resource].toFixed(2)}`);
        }
    });
    if (hasChanged) {
        console.log('Resources updated:', gameState.resources);
        updateHUD();
        saveGame();
    } else {
        console.log('No resource changes detected, production:', gameState.production);
    }
}

setInterval(updateResources, 30000); // Update every 30 seconds
setInterval(saveGame, 30000);
