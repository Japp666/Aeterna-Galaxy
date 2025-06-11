console.log('utils.js loaded');

const defaultGameState = {
    coach: { name: '' },
    club: { name: '', budget: 5000000, energy: 500, stadiumCapacity: 10000, trainingCenterLevel: 1, recoveryCenterLevel: 0 },
    players: [
        { id: 'p1', name: 'Andrei Popa', position: 'Portar', rating: 70, moral: 75, salary: 10000 },
        { id: 'p2', name: 'Mihai Ionescu', position: 'Fundaș', rating: 65, moral: 70, salary: 8000 },
        { id: 'p3', name: 'Ion Georgescu', position: 'Fundaș', rating: 68, moral: 65, salary: 9000 },
        { id: 'p4', name: 'Alex Stoica', position: 'Fundaș', rating: 67, moral: 70, salary: 8500 },
        { id: 'p5', name: 'Cristian Marin', position: 'Fundaș', rating: 66, moral: 75, salary: 8000 },
        { id: 'p6', name: 'Radu Popescu', position: 'Mijlocaș', rating: 72, moral: 80, salary: 12000 },
        { id: 'p7', name: 'Gabriel Vasile', position: 'Mijlocaș', rating: 70, moral: 70, salary: 11000 },
        { id: 'p8', name: 'Florin Matei', position: 'Mijlocaș', rating: 69, moral: 65, salary: 10000 },
        { id: 'p9', name: 'Bogdan Dumitru', position: 'Mijlocaș', rating: 68, moral: 75, salary: 9500 },
        { id: 'p10', name: 'Vlad Niculae', position: 'Atacant', rating: 73, moral: 80, salary: 15000 },
        { id: 'p11', name: 'Dan Munteanu', position: 'Atacant', rating: 71, moral: 70, salary: 13000 },
        { id: 'p12', name: 'Tudor Barbu', position: 'Portar', rating: 65, moral: 60, salary: 7000 },
        { id: 'p13', name: 'Paul Ciobanu', position: 'Fundaș', rating: 64, moral: 65, salary: 7500 },
        { id: 'p14', name: 'Robert Stan', position: 'Fundaș', rating: 63, moral: 70, salary: 7000 },
        { id: 'p15', name: 'Lucian Dragan', position: 'Mijlocaș', rating: 66, moral: 65, salary: 8000 },
        { id: 'p16', name: 'Marian Preda', position: 'Mijlocaș', rating: 65, moral: 60, salary: 7500 },
        { id: 'p17', name: 'Costin Voicu', position: 'Atacant', rating: 67, moral: 70, salary: 9000 },
        { id: 'p18', name: 'Emil Radu', position: 'Atacant', rating: 66, moral: 65, salary: 8500 }
    ],
    tactics: { formation: '4-4-2', style: 'balanced' },
    league: { currentSeason: 1, currentWeek: 1, standings: [], schedule: [] },
    facilities: { stadiumLevel: 1, trainingCenterLevel: 1, recoveryCenterLevel: 0 },
    academyPlayers: [],
    gameDate: new Date('2025-09-01'),
    isBuilding: false,
    currentBuilding: null,
    buildStartTime: null
};

let gameState = { ...defaultGameState };

function canAfford(cost) {
    return gameState.club.budget >= cost.budget && gameState.club.energy >= cost.energy;
}

function deductResources(cost) {
    gameState.club.budget = Math.max(0, gameState.club.budget - (cost.budget || 0));
    gameState.club.energy = Math.max(0, gameState.club.energy - (cost.energy || 0));
}

async function loadComponent(component, targetId = 'content') {
    console.log(`Fetching components/${component}.html`);
    try {
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        document.getElementById(targetId).innerHTML = text;
        console.log(`Loaded ${component}.html into #${targetId}`);
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
        localStorage.setItem('footballManager', JSON.stringify(gameState));
        console.log('Game saved');
    } catch (error) {
        console.error('Error saving game:', error);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('footballManager');
        if (saved) {
            const loadedState = JSON.parse(saved);
            gameState = { ...defaultGameState, ...loadedState };
            if (gameState.isBuilding) {
                console.log('Resetting stuck isBuilding state');
                gameState.isBuilding = false;
                gameState.currentBuilding = null;
                gameState.buildStartTime = null;
            }
            console.log('Game loaded from localStorage:', gameState);
        } else {
            console.log('No saved game found, using default state');
        }
    } catch (error) {
        console.error('Error loading game:', error);
        resetGame();
    }
}

function resetGame() {
    localStorage.removeItem('footballManager');
    gameState = { ...defaultGameState };
    console.log('Game reset');
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
    gameState.club.energy = Math.min(gameState.club.energy + 100 / (24 * 60 * 2), 1000); // 100/day, update every 30s
    if (gameState.facilities.recoveryCenterLevel > 0) {
        gameState.players.forEach(player => {
            player.moral = Math.min(player.moral + (10 * gameState.facilities.recoveryCenterLevel) / (24 * 60 * 2), 100);
        });
    }
    saveGame();
    if (typeof updateHUD === 'function') updateHUD();
}

setInterval(updateResources, 30000);
setInterval(saveGame, 30000);
