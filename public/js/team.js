console.log('team.js loaded');

function initializeTeam() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) {
        console.error('Team grid container not found');
        return;
    }

    let html = '';
    gameState.players.forEach(player => {
        html += `
            <div class="card">
                <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${player.name}">
                <h3>${player.name}</h3>
                <p>Poziție: ${player.position}</p>
                <p>Rating: ${player.rating}</p>
                <p>Moral: ${player.moral}</p>
                <p>Salariu: ${player.salary.toLocaleString()} €</p>
                <button class="sf-button" onclick="trainPlayer('${player.id}')" ${player.moral >= 100 ? 'disabled' : ''}>Antrenează</button>
            </div>
        `;
    });
    teamGrid.innerHTML = html;
}

function trainPlayer(playerId) {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    if (!canAfford({ energy: 50 })) {
        showMessage('Energie insuficientă!', 'error');
        return;
    }

    deductResources({ energy: 50 });
    player.moral = Math.min(player.moral + 5, 100);
    player.rating = Math.min(player.rating + (gameState.facilities.trainingCenterLevel * 0.5), 100);
    saveGame();
    initializeTeam();
    updateHUD();
    showMessage(`${player.name} antrenat!`, 'success');
}
