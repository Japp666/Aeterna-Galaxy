console.log('utils.js loaded');

function saveGame() {
    localStorage.setItem('galaxiaAeterna', JSON.stringify(gameState));
    console.log('Game saved');
}

function loadGame() {
    const saved = localStorage.getItem('galaxiaAeterna');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
        console.log('Game loaded:', gameState);
    }
}

function updateResources() {
    console.log('Updating resources');
    let production = { metal: 0, crystal: 0, helium: 0, energy: 0, research: 0 };
    if (Object.keys(gameState.buildings).length === 0) {
        production.metal = 10;
        console.log('No buildings, minimal production:', production);
    }
    for (const [resource, amount] of Object.entries(production)) {
        gameState.resources[resource] += amount;
        console.log(`Updated ${resource}: +${amount.toFixed(2)}, new: ${gameState.resources[resource].toFixed(2)}`);
    }
    console.log('Resources:', gameState.resources);
    saveGame();
}

// Clear any existing intervals
if (window.resourceInterval) clearInterval(window.resourceInterval);
window.resourceInterval = setInterval(updateResources, 5000);
