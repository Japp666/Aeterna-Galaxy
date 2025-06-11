// console.log('utils.js loaded');

const defaultGameState = {
    coach: { name: '' },
    club: { 
        name: '', 
        budget: 5000000, 
        energy: 500, 
        stadiumCapacity: 10000, 
        trainingCenterLevel: 1, 
        recoveryCenterLevel: 0,
        teamBusLevel: 0 // New for team bus
    },
    players: [
        { id: 'p1', name: 'Zorak Vyn', position: 'Portar', rating: 70, moral: 75, stamina: 80, salary: 10000 },
        { id: 'p2', name: 'Kael Dror', position: 'Fundaș', rating: 65, moral: 70, stamina: 85, salary: 8000 },
        { id: 'p3', name: 'Taryn Sol', position: 'Fundaș', rating: 68, moral: 65, stamina: 80, salary: 9000 },
        { id: 'p4', name: 'Vex Nor', position: 'Fundaș', rating: 67, moral: 70, stamina: 82, salary: 8500 },
        { id: 'p5', name: 'Ryn Zeth', position: 'Fundaș', rating: 66, moral: 75, stamina: 78, salary: 8000 },
        { id: 'p6', name: 'Sylas Krynn', position: 'Mijlocaș', rating: 72, moral: 80, stamina: 90, salary: 12000 },
        { id: 'p7', name: 'Jor Valth', position: 'Mijlocaș', rating: 70, moral: 70, stamina: 85, salary: 11000 },
        { id: 'p8', name: 'Eryn Quill', position: 'Mijlocaș', rating: 69, moral: 65, stamina: 80, salary: 10000 },
        { id: 'p9', name: 'Dren Vox', position: 'Mijlocaș', rating: 68, moral: 75, stamina: 82, salary: 9500 },
        { id: 'p10', name: 'Zane Tor', position: 'Atacant', rating: 73, moral: 80, stamina: 88, salary: 15000 },
        { id: 'p11', name: 'Kyra Zenith', position: 'Atacant', rating: 71, moral: 70, stamina: 85, salary: 13000 },
        { id: 'p12', name: 'Lyx Pryn', position: 'Portar', rating: 65, moral: 60, stamina: 75, salary: 7000 },
        { id: 'p13', name: 'Thar Elyon', position: 'Fundaș', rating: 64, moral: 65, stamina: 80, salary: 7500 },
        { id: 'p14', name: 'Nyx Sarr', position: 'Fundaș', rating: 63, moral: 70, stamina: 78, salary: 7000 },
        { id: 'p15', name: 'Coryn Thal', position: 'Mijlocaș', rating: 66, moral: 65, stamina: 80, salary: 8000 },
        { id: 'p16', name: 'Vyrn Kade', position: 'Mijlocaș', rating: 65, moral: 60, stamina: 75, salary: 7500 },
        { id: 'p17', name: 'Xan Ryde', position: 'Atacant', rating: 67, moral: 70, stamina: 82, salary: 9000 },
        { id: 'p18', name: 'Zyra Vonn', position: 'Atacant', rating: 66, moral: 65, stamina: 80, salary: 8500 }
    ],
    tactics: { formation: '4-4-2', style: 'balanced' },
    league: { currentSeason: 1, currentWeek: 1, standings: [], schedule: [] },
    facilities: { 
        stadiumLevel: 1, 
        trainingCenterLevel: 1, 
        recoveryCenterLevel: 0, 
        trainingFieldLevel: 0, 
        teamBusLevel: 0 
    },
    academyPlayers: [],
    transferMarket: [],
    competitions: {
        stellarLeague: { active: true, tier: 3 },
        galacticCup: { active: false },
        cosmicChallenge: { active: false }
    },
    gameDate: new Date('2025-09-01')
};

let gameState = { ...defaultGameState };

function canAfford(cost) {
    return gameState.club.budget >= (cost.budget || 0) && gameState.club.energy >= (cost.energy || 0);
}

function deductResources(cost) {
    gameState.club.budget = Math.max(0, gameState.club.budget - (cost.budget || 0));
    gameState.club.energy = Math.max(0, gameState.club.energy - (cost.energy || 0));
}

async function loadComponent(component, targetId = 'content') {
    // console.log(`Fetching components/${component}.html`);
    try {
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        document.getElementById(targetId).innerHTML = text;
        // console.log(`Loaded ${component}.html into #${targetId}`);
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error);
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
        const serializedState = {
            ...gameState,
            gameDate: gameState.gameDate.toISOString() // Serialize Date
        };
        localStorage.setItem('footballManager', JSON.stringify(serializedState));
        // console.log('Game saved');
    } catch (error)
        console.error('Error saving game:', error);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('footballManager');
        if (saved) {
            const loadedState = JSON.parse(saved);
            gameState = {
                ...defaultGameState,
                ...loadedState,
                gameDate: new Date(loadedState.gameDate) // Deserialize Date
            };
            if (gameState.isBuilding) {
                // console.log('Resetting stuck isBuilding state');
                gameState.isBuilding = false;
                gameState.currentBuilding = null;
                gameState.buildStartTime = null;
            }
            // console.log('Game loaded from localStorage:', gameState);
        } else {
            // console.log('No saved game found, using default state');
        }
    } catch (error) {
        console.error('Error loading game:', error);
        resetGame();
    }
}

function resetGame() {
    localStorage.removeItem('footballManager');
    gameState = { ...defaultGameState };
    updateResources();
    saveGame();
    const coachModal = document.getElementById('coach-modal');
    const tutorialModal = document.getElementById('tutorial-modal');
    const header = document.querySelector('header');
    const nav = document.querySelector('.sidebar-menu');
    const hud = document.getElementById('hud');
    const content = document.getElementById('content');
    const resetButton = document.getElementById('reset-game');

    if (coachModal) coachModal.style.display = 'flex';
    if (tutorialModal) tutorialModal.style.display = 'none';
    if (header) header.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (hud) hud.style.display = 'none';
    if (content) content.style.display = 'none';
    if (resetButton) resetButton.style.display = 'none';
}

function updateResources() {
    gameState.club.energy = Math.min(gameState.club.energy + 50 / (24 * 60 * 2), 1000); // 50/hour, update every 30s
    if (gameState.facilities.recoveryCenterLevel > 0) {
        gameState.players.forEach(player => {
            player.moral = Math.min(player.moral + (10 * gameState.facilities.recoveryCenterLevel) / (24 * 60 * 2), 100);
            player.stamina = Math.min(player.stamina + (5 * gameState.facilities.recoveryCenterLevel) / (24 * 60 * 2), 100);
        });
    }
    saveGame();
    if (typeof updateHUD === 'function') updateHUD();
}

setInterval(updateResources, 30000);
