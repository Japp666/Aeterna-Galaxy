console.log('utils.js loaded');

const gameState = {
    player: { nickname: '', race: '' },
    resources: { metal: 2000, crystal: 2000, helium: 1000, energy: 1000, research: 200 },
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
        { key: 'advanced_mining', name: 'Minare Avansată', cost: 100, time: 30, effect: { metal: 1.1, crystal: 1.1 } },
        { key: 'helium_refining', name: 'Rafinare Heliu', cost: 150, time: 40, effect: { helium: 1.15 } },
        { key: 'fusion_energy', name: 'Energie Fuzionară', cost: 200, time: 50, effect: { energyConsumption: 0.8 } },
        { key: 'ionic_propulsion', name: 'Propulsie Ionică', cost: 300, time: 60, effect: { shipSpeed: 1.2 } },
        { key: 'nanotech_armor', name: 'Armură Nanoteh', cost: 250, time: 55, effect: { hp: 1.15 } },
        { key: 'galactic_exploration', name: 'Explorare Galactică', cost: 400, time: 80, effect: { exploration: true } }
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
    players: [] // Adăugat pentru harta multiplayer
};

async function loadComponent(component, targetId = 'content') {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) {
        console.error(`Target div #${targetId} not found`);
        return;
    }
    try {
        console.log(`Fetching ${component}.html`);
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${component}.html`);
        const text = await response.text();
        targetDiv.innerHTML = text;
        console.log(`Loaded ${component}.html into #${targetId}`);
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error.message);
    }
}

function showMessage(message, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${type}`;
    msgDiv.textContent = message;
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
    console.log('updateResources called, production:', gameState.production);
    let hasChanged = false;
    Object.keys(gameState.production).forEach(resource => {
        const production = gameState.production[resource] || 0;
        const bonus = gameState.raceBonus[resource] || 1;
        const newValue = gameState.resources[resource] + (production * bonus) / 60; // 1 minut
        const max = resource === 'research' ? Infinity : { metal: 100000, crystal: 100000, helium: 50000, energy: 50000 }[resource];
        if (Math.abs(newValue - gameState.resources[resource]) > 0.1) {
            gameState.resources[resource] = Math.min(newValue, max);
            hasChanged = true;
        }
    });
    if (hasChanged) {
        console.log('Resources updated:', gameState.resources);
        updateHUD();
        saveGame();
    } else {
        console.log('No resource changes detected');
    }
}

setInterval(updateResources, 60000); // 1 minut
setInterval(saveGame, 30000);
