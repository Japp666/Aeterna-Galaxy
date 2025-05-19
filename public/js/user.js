const user = {
    name: '',
    race: '',
    resources: {
        metal: 1000,
        crystal: 800,
        energy: 500
    },
    score: 0,
    buildings: {},
    research: {},
    fleet: {
        small: 0,
        medium: 0,
        large: 0
    },
    lastOnline: Date.now()
};

function updateResources(type, amount) {
    if (user.resources[type] !== undefined) {
        user.resources[type] += amount;
    }
}

function deductResources(cost) {
    Object.keys(cost).forEach(resource => {
        if (user.resources[resource] >= cost[resource]) {
            user.resources[resource] -= cost[resource];
        }
    });
}

function canAfford(cost) {
    return Object.keys(cost).every(resource => user.resources[resource] >= cost[resource]);
}

function updateScore(points) {
    user.score += points;
}

function showMessage(text) {
    alert(text);
}

function updateHUD() {
    document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
    document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
    document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);
    document.getElementById('scoreAmount').textContent = user.score;
}

export { user, updateResources, deductResources, canAfford, updateScore, showMessage, updateHUD };
