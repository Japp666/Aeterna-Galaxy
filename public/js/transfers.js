console.log('transfers.js loaded');

function initializeTransfers() {
    const transferGrid = document.getElementById('transfer-grid');
    if (!transferGrid) {
        console.error('Transfer grid container not found');
        return;
    }

    // Generate transfer market players if none exist
    if (!gameState.transferMarket || gameState.transferMarket.length === 0) {
        gameState.transferMarket = generateTransferMarket();
        saveGame();
    }

    let html = '<h3>Jucători disponibili</h3><div style="display: flex; flex-wrap: wrap; gap: 20px;">';
    gameState.transferMarket.forEach(player => {
        html += `
            <div class="card">
                <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${player.name}">
                <h3>${player.name}</h3>
                <p>Poziție: ${player.position}</p>
                <p>Rating: ${player.rating}</p>
                <p>Preț: ${player.price.toLocaleString()} €</p>
                <p>Salariu: ${player.salary.toLocaleString()} €</p>
                <button class="sf-button" onclick="buyPlayer('${player.id}')" ${gameState.club.budget < player.price || gameState.players.length >= 25 ? 'disabled' : ''}>Cumpără</button>
            </div>
        `;
    });
    html += '</div>';

    html += '<h3>Jucătorii tăi</h3><div style="display: flex; flex-wrap: wrap; gap: 20px;">';
    gameState.players.forEach(player => {
        html += `
            <div class="card">
                <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${player.name}">
                <h3>${player.name}</h3>
                <p>Poziție: ${player.position}</p>
                <p>Rating: ${player.rating}</p>
                <p>Valoare: ${(player.price / 2).toLocaleString()} €</p>
                <button class="sf-button" onclick="sellPlayer('${player.id}')">Vinde</button>
            </div>
        `;
    });
    html += '</div>';

    transferGrid.innerHTML = html;
}

function generateTransferMarket() {
    const positions = ['Portar', 'Fundaș', 'Mijlocaș', 'Atacant'];
    const names = ['Popa', 'Ionescu', 'Georgescu', 'Stoica', 'Marin', 'Popescu', 'Vasile', 'Matei', 'Dumitru', 'Niculae'];
    const market = [];
    for (let i = 0; i < 20; i++) {
        const rating = Math.floor(Math.random() * 35) + 50; // 50-85
        const price = rating * 40000; // 2M-3.4M
        const salary = rating * 500; // 25K-42.5K
        market.push({
            id: `tm${i}`,
            name: `${names[Math.floor(Math.random() * names.length)]} ${String.fromCharCode(65 + i)}`,
            position: positions[Math.floor(Math.random() * positions.length)],
            rating,
            price,
            salary
        });
    }
    return market;
}

function buyPlayer(playerId) {
    const player = gameState.transferMarket.find(p => p.id === playerId);
    if (!player) return;

    if (gameState.players.length >= 25) {
        showMessage('Lotul este plin!', 'error');
        return;
    }

    if (!canAfford({ budget: player.price })) {
        showMessage('Bani insuficienți!', 'error');
        return;
    }

    deductResources({ budget: player.price });
    gameState.players.push({ ...player });
    gameState.transferMarket = gameState.transferMarket.filter(p => p.id !== playerId);
    saveGame();
    initializeTransfers();
    updateHUD();
    showMessage(`${player.name} cumpărat!`, 'success');
}

function sellPlayer(playerId) {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    gameState.club.budget += player.price / 2;
    gameState.players = gameState.players.filter(p => p.id !== playerId);
    saveGame();
    initializeTransfers();
    updateHUD();
    showMessage(`${player.name} vândut!`, 'success');
}
