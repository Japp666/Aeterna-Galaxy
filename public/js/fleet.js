<xaiArtifact artifact_id="7c574d40-6b84-47b1-9a3e-b27a471a06ed" artifact_version_id="659c5925-5250-469e-8de0-609fba7fd5ac" title="fleet.js" contentType="text/javascript">
console.log('fleet.js loaded');

function initializeFleet() {
    console.log('initializeFleet called');
    const container = document.querySelector('.fleet-container');
    if (!container) {
        console.error('Fleet container not found');
        return;
    }
    container.innerHTML = '';

    const shipyardLevel = gameState.buildings.shipyard || 0;
    if (!shipyardLevel) {
        container.innerHTML = '<p>Construiește un Șantier Naval pentru a crea nave!</p>';
        return;
    }

    gameState.fleetList.forEach((ship, index) => {
        const cost = ship.cost;
        const canAfford = Object.entries(cost).every(([res, amt]) => gameState.resources[res] >= amt);
        const card = document.createElement('div');
        card.className = 'fleet-card';
        card.innerHTML = `
            <h3>${ship.name}</h3>
            <p>Cost: ${Object.entries(cost).map(([r, a]) => `${r}: ${a}`).join(', ')}</p>
            <p>Atac: ${ship.attack}, HP: ${ship.hp}</p>
            <button class="build-ship" data-index="${index}" ${canAfford && !gameState.isBuildingShip ? '' : 'disabled'}>Construiește</button>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.build-ship').forEach(btn => {
        btn.onclick = () => {
            if (gameState.isBuildingShip) {
                showMessage('O navă este în construire!', 'error');
                return;
            }

            const index = parseInt(btn.dataset.index);
            const ship = gameState.fleetList[index];
            gameState.isBuildingShip = true;
            Object.entries(ship.cost).forEach(([res, amt]) => gameState.resources[res] -= amt);
            document.querySelectorAll('.build-ship').forEach(b => b.disabled = true);

            let timeLeft = ship.time;
            const interval = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    gameState.fleet.push({ ...ship });
                    gameState.isBuildingShip = false;
                    showMessage(`${ship.name} construit!`, 'success');
                    initializeFleet();
                    updateHUD();
                }
            }, 1000);
        };
    });
}
