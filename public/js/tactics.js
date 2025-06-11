console.log('tactics.js loaded');

function initializeTactics() {
    const tacticsForm = document.getElementById('tactics-form');
    if (!tacticsForm) {
        console.error('Tactics form not found');
        return;
    }

    const formationSelect = document.getElementById('formation-select');
    const styleSelect = document.getElementById('style-select');
    const saveButton = document.getElementById('save-tactics');
    const playerGrid = document.getElementById('player-grid');

    formationSelect.value = gameState.tactics.formation;
    styleSelect.value = gameState.tactics.style;

    let html = '';
    gameState.players.forEach(player => {
        html += `
            <div class="card" draggable="true" data-player-id="${player.id}">
                <h3>${player.name}</h3>
                <p>Poziție: ${player.position}</p>
                <p>Rating: ${player.rating}</p>
                <p>Stamina: ${player.stamina}</p>
                <select class="role-select" data-player-id="${player.id}">
                    <option value="default">Implicit</option>
                    <option value="offensive">Ofensiv</option>
                    <option value="defensive">Defensiv</option>
                </select>
            </div>
        `;
    });
    playerGrid.innerHTML = html;

    saveButton.addEventListener('click', () => {
        gameState.tactics.formation = formationSelect.value;
        gameState.tactics.style = styleSelect.value;
        document.querySelectorAll('.role-select').forEach(select => {
            const playerId = select.getAttribute('data-player-id');
            gameState.players.find(p => p.id === playerId).role = select.value;
        });
        saveGame();
        showMessage('Tactică salvată!', 'success');
    });
}
