// console.log('academy.js loaded');

function initializeAcademy() {
    const academyGrid = document.getElementById('academy-grid');
    if (!academyGrid) {
        console.error('Academy grid container not found');
        return;
    }

    // Generate academy player if none exists
    if (!gameState.academyPlayers.length) {
        gameState.academyPlayers = [generateAcademyPlayer()];
        saveGame();
    }

    const player = gameState.academyPlayers[0];
    let html = `
        <div class="card">
            <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${player.name}">
            <h3>${player.name}</h3>
            <p>Poziție: ${player.position}</p>
            <p>Rating: ${player.rating}</p>
            <p>Cost: 500 Energie</p>
            <p>Timp: 30 s</p>
            <button class="sf-button" onclick="promotePlayer('${player.id}')" ${gameState.isBuilding || !canAfford({ energy: 500 }) || gameState.players.length >= 25 ? 'disabled' : ''}>Promovează</button>
        </div>
    `;
    academyGrid.innerHTML = html;

    checkBuildingProgress();
}

function generateAcademyPlayer() {
    const positions = ['Portar', 'Fundaș', 'Mijlocaș', 'Atacant'];
    const names = ['Popa', 'Ionescu', 'Georgescu', 'Stoica', 'Marin'];
    const rating = Math.floor(Math.random() * 20) + 50; // 50-70
    return {
        id: `ac${Date.now()}`,
        name: `${names[Math.floor(Math.random() * names.length)]} Jr.`,
        position: positions[Math.floor(Math.random() * positions.length)],
        rating,
        moral: 80,
        salary: rating * 200,
        price: rating * 10000
    };
}

function promotePlayer(playerId) {
    const player = gameState.academyPlayers.find(p => p.id === playerId);
    if (!player || gameState.isBuilding || gameState.players.length >= 25) return;

    if (!canAfford({ energy: 500 })) {
        showMessage('Energie insuficientă!', 'error');
        return;
    }

    deductResources({ energy: 500 });
    gameState.isBuilding = true;
    gameState.currentBuilding = 'academy';
    gameState.buildStartTime = Date.now();
    gameState.players.push({ ...player });
    gameState.academyPlayers = [];
    saveGame();
    setTimeout(() => {
        gameState.isBuilding = false;
        gameState.currentBuilding = null;
        gameState.buildStartTime = null;
        gameState.academyPlayers = [generateAcademyPlayer()];
        saveGame();
        initializeAcademy();
        showMessage(`${player.name} promovat!`, 'success');
    }, 30000);
    showMessage(`Promovare ${player.name} începută!`, 'success');
}
