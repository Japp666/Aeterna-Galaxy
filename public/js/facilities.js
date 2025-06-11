console.log('facilities.js loaded');

const facilities = [
    {
        id: 'stadium',
        name: 'Stadion',
        description: 'Crește veniturile din bilete.',
        baseCost: { budget: 1000000 },
        baseTime: 60,
        effect: level => `Capacitate: ${(10000 + level * 5000).toLocaleString()} locuri`
    },
    {
        id: 'trainingCenter',
        name: 'Centru de Antrenament',
        description: 'Îmbunătățește rating-ul jucătorilor.',
        baseCost: { budget: 2000000 },
        baseTime: 60,
        effect: level => `Bonus: +${level * 5} rating`
    },
    {
        id: 'recoveryCenter',
        name: 'Centru de Recuperare',
        description: 'Crește moralul jucătorilor zilnic.',
        baseCost: { budget: 1500000 },
        baseTime: 60,
        effect: level => `Bonus: +${level * 10} moral/zi`
    }
];

function initializeFacilities() {
    const facilitiesGrid = document.getElementById('facilities-grid');
    if (!facilitiesGrid) {
        console.error('Facilities grid container not found');
        return;
    }

    let html = '';
    facilities.forEach(facility => {
        const level = gameState.facilities[`${facility.id}Level`];
        const cost = { budget: facility.baseCost.budget * Math.pow(1.5, level) };
        const time = facility.baseTime * (1 + level * 0.2);
        html += `
            <div class="card">
                <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${facility.name}">
                <h3>${facility.name}</h3>
                <p>Nivel: ${level}</p>
                <p>${facility.description}</p>
                <p>${facility.effect(level)}</p>
                <p>Cost: ${cost.budget.toLocaleString()} €</p>
                <p>Timp: ${Math.ceil(time)} s</p>
                <button class="sf-button" onclick="upgradeFacility('${facility.id}')" ${gameState.isBuilding || !canAfford(cost) ? 'disabled' : ''}>Upgrade</button>
            </div>
        `;
    });
    facilitiesGrid.innerHTML = html;

    checkBuildingProgress();
}

function upgradeFacility(facilityId) {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility || gameState.isBuilding) return;

    const level = gameState.facilities[`${facilityId}Level`];
    const cost = { budget: facility.baseCost.budget * Math.pow(1.5, level) };

    if (!canAfford(cost)) {
        showMessage('Resurse insuficiente!', 'error');
        return;
    }

    deductResources(cost);
    gameState.isBuilding = true;
    gameState.currentBuilding = facilityId;
    gameState.buildStartTime = Date.now();
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
    const elapsed = (Date.now() - gameState.buildStartTime) / 1000;

    if (elapsed >= time) {
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
