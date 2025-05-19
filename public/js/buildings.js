import { user, showMessage, canAfford, deductResources } from './user.js';

const buildingData = [
    { id: 'metalMine', name: 'Extractor Metal', description: 'Extrage metal.', baseProduction: 10, maxLevel: 20, cost: { metal: 200, crystal: 150, energy: 100 }, unlock: () => true },
    { id: 'crystalMine', name: 'Extractor Cristal', description: 'Extrage cristal.', baseProduction: 7, maxLevel: 20, cost: { metal: 300, crystal: 200, energy: 120 }, unlock: () => true },
    { id: 'energyPlant', name: 'Generator Energie', description: 'Produce energie.', baseProduction: 5, maxLevel: 20, cost: { metal: 250, crystal: 180, energy: 0 }, unlock: () => true },
];

export function showBuildings() {
    const container = document.getElementById('buildings');
    container.innerHTML = '';

    buildingData.forEach(building => {
        const level = user.buildings[building.id] || 0;
        const isUnlocked = building.unlock();
        const nextCost = calculateCost(building, level + 1);

        const div = document.createElement('div');
        div.className = `building-card ${!isUnlocked ? 'locked' : ''}`;
        div.innerHTML = `
            <h3>${building.name}</h3>
            <p>${building.description}</p>
            <p>Nivel: ${level}</p>
            <p>Cost upgrade: ${formatCost(nextCost)}</p>
            <button ${!isUnlocked ? 'disabled' : ''} onclick="upgradeBuilding('${building.id}')">Upgrade</button>
        `;
        container.appendChild(div);
    });
}

window.upgradeBuilding = function (id) {
    const building = buildingData.find(b => b.id === id);
    const level = user.buildings[id] || 0;
    const cost = calculateCost(building, level + 1);

    if (!canAfford(cost)) {
        showMessage('Nu ai suficiente resurse.');
        return;
    }

    deductResources(cost);
    user.buildings[id] = level + 1;
    user.score += (level + 1) * 10;
    showBuildings();
};

function calculateCost(building, level) {
    const factor = 1.5;
    return {
        metal: Math.floor(building.cost.metal * Math.pow(factor, level - 1)),
        crystal: Math.floor(building.cost.crystal * Math.pow(factor, level - 1)),
        energy: Math.floor(building.cost.energy * Math.pow(factor, level - 1))
    };
}

function formatCost(cost) {
    return `M: ${cost.metal}, C: ${cost.crystal}, E: ${cost.energy}`;
}
