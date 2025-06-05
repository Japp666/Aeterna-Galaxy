console.log('utils.js loaded');

function saveGame() {
    localStorage.setItem('galaxiaAeterna', JSON.stringify(gameState));
    console.log('Game saved');
}

function loadGame() {
    const saved = localStorage.getItem('galaxiaAeterna');
    if (saved) {
        window.gameState = JSON.parse(saved);
        console.log('Game loaded:', gameState);
    }
}

function updateResources() {
    console.log('Updating resources');
    const production = { metal: 10, crystal: 0, helium: 0, energy: 0, research: 0 };
    if (!Object.keys(gameState.buildings).length) {
        console.log('No buildings, minimal production:', production);
    }
    for (const resource in production) {
        gameState.resources[resource] = (gameState.resources[resource] || 0) + production[resource];
        console.log(`Updated ${resource}: +${production[resource].toFixed(2)}, new: ${gameState.resources[resource].toFixed(2)}`);
    }
    console.log('Resources:', gameState.resources);
    saveGame();
}

setInterval(updateResources, 5000);
