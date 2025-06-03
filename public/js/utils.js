console.log('utils.js loaded');

function fetchComponent(url) {
    console.log('Fetching', url);
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            console.log('Loaded', url);
            return html;
        })
        .catch(err => console.error('Failed to fetch', url, err));
}

function showMessage(message, type) {
    console.log(`Message: ${message} (${type})`);
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function saveGame() {
    console.log('Game saved');
    localStorage.setItem('galaxiaAeterna', JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem('galaxiaAeterna');
    if (savedGame) {
        window.gameState = JSON.parse(savedGame);
        console.log('Game loaded from localStorage:', gameState);
    } else {
        console.log('No saved game found, using default gameState');
    }
}

function updateResources() {
    console.log('updateResources called, current production:', gameState.production || {});
    const production = { metal: 0, crystal: 0, helium: 0, energy: 0, research: 0 };

    // Fallback if no buildings
    if (!gameState.buildings || Object.keys(gameState.buildings).length === 0) {
        production.metal = 10; // Minimal production to avoid zero
        console.log('No buildings found, applying minimal production:', production);
    } else {
        Object.keys(gameState.buildings).forEach(key => {
            const building = gameState.buildingsList.find(b => b.key === key);
            if (building && building.production) {
                const level = gameState.buildings[key];
                Object.keys(building.production).forEach(resource => {
                    production[resource] += building.production[resource] * Math.pow(1.1, level - 1);
                });
            }
        });
    }

    let changed = false;
    Object.keys(production).forEach(resource => {
        if (production[resource] !== 0) {
            gameState.resources[resource] = (gameState.resources[resource] || 0) + production[resource];
            console.log(`Updated ${resource}: +${production[resource].toFixed(2)}, new value: ${gameState.resources[resource].toFixed(2)}`);
            changed = true;
        }
    });

    if (!changed) {
        console.log('No resource changes detected, production:', production);
    } else {
        console.log('Resources updated:', gameState.resources);
    }

    saveGame();
}

setInterval(updateResources, 1000);
