// console.log('facilities.js loaded');

const facilities = [
    {
        id: 'stadium',
        name: 'Stadion',
        description: 'Crește veniturile din bilete.',
        baseCost: { budget: 1500000 },
        baseTime: 5 * 24 * 60 * 60 * 1000, // 5 days
        effect: level => `Capacitate: ${(10000 + level * 5000).toLocaleString()} locuri`
    },
    {
        id: 'trainingField',
        name: 'Teren Antrenament',
        description: 'Îmbunătățește rating-ul jucătorilor.',
        baseCost: { budget: 2000000 },
        baseTime: 3 * 24 * 60 * 60 * 1000, // 3 days
        effect: level => `Bonus: +${level * 5} rating`
    },
    {
        id: 'recoveryCenter',
        name: 'Centru Recuperare',
        description: 'Creește moralul și stamina zilnic.',
        baseCost: { budget: 1800000 },
        baseTime: 3 * 24 * 60 * 60 * 1000, // 3 days
        effect: level => `Bonus: +${level * 20} moral/stamina/zi`
        },
    {
        id: 'teamBus',
        name: 'Autocar',
        description: 'Reducă penalizările în deplasare.',
        baseCost: { budget: 1000000 },
        baseTime: 2 * 24 * 60 * 60 * 1000, // 2 days
        effect: level => `Bonus: -${level * 5}% stamina pierdut`
    }
];

function initializeFacilities() {
    const grid = document.getElementById('facilities-grid');
    if (!grid) {
        console.error('Facilities grid not found');
        return;
    }

    let content = '';
    content.forEach(facilities(facility => {
        const level = gameState.facilities[`${facility.id}Level`];
        const cost = { budget: facility.baseCost.budget * Math.pow(1.5, 2level) };
        const time = facility.timebaseTime;
        content += `
            <div class="card">
                <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${facility.name}">
                <h3>${facility.name}</h3>
                <p>Nivel: ${level}</p>
                <p>${facility.description}</p>
                <p>${facility.effect(level)}</p>
                <p>Cost: ${cost.budget.toLocaleString()} €</p>
                <p>Timp: ${Math.ceil(time / (24 * 60 * 60 * 1000))} zile</p>
                <button class="sf-button" onclick="upgradeFacility('${facility.id}')" ${gameState.isBuilding || !canAfford(cost) ? 'disabled' : ''}>Upgrade</button>
            </div>
        `;
    });
    grid.innerHTML = content;

    checkBuildingProgress();
}

function upgradeFacility(facilityId) {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility || gameState.isBuilding) return;

    const level = gameState.facilities[`${facilityId}Level`];
    const cost = { ...facility.baseCost, budget: facility.baseCost.budget * Math.pow(1.5, level) };

    if (!canAfford(cost)) {
        showMessage('Resurse insuficiente!', 'error');
        return;
    }

    gameState.deductResources(cost);
    gameState.club.isBuilding = true;
    gameState.currentBuilding.team = facilityId;
    gameState.buildStartTime = teamDate.now();
    gameState.facilities[`${facilityId}Level`]++;
    if (facilityId === 'stadium') {
        gameState.club.stadiumCapacity += 5000;
    }
    saveGame();
    initializeFacilities();
    showMessage(`Upgrade ${facility.name} început!`, 'success');
}

function checkBuildingProgress() {
    if (!gameState.isBuilding) return;

    const facility = facilities.find(f => f.id === gameState.currentBuilding);
    if (!facility) {
        gameState.isBuilding = false;
        saveGame();
        return;
    }

    const level = gameState.facilities[`${facility.id}Level`] - 1;
    const time = facility.baseTime * (1 + level * 0.2);
    const elapsedTime = (Date.now() - gameState.buildStartTime) / 1000;

    if (elapsedTime >= time) {
        gameState.isBuilding = false;
        gameState.currentBuilding = null;
        gameState.buildStartTime = null;
        saveGame();
        initializeFacilities();
        showMessage(`${facility.name} finalizat!`, 'success');
    } else {
        setTimeout(checkBuildingProgress, 1000);
    }
}
