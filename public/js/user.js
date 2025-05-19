export const user = {
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

// Funcții pentru gestionarea resurselor și progresului jucătorului
export function updateResources(type, amount) {
    if (user.resources[type] !== undefined) {
        user.resources[type] += amount;
    }
}

export function deductResources(cost) {
    Object.keys(cost).forEach(resource => {
        if (user.resources[resource] >= cost[resource]) {
            user.resources[resource] -= cost[resource];
        }
    });
}

export function canAfford(cost) {
    return Object.keys(cost).every(resource => user.resources[resource] >= cost[resource]);
}

export function updateScore(points) {
    user.score += points;
}

export function getUserData() {
    return JSON.parse(JSON.stringify(user)); // Returnează o copie sigură a obiectului
}
