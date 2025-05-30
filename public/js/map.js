console.log('map.js loaded');

function initializeMap() {
    console.log('initializeMap called');
    const container = document.querySelector('.map-container');
    if (!container) {
        console.error('Map container not found');
        return;
    }
    container.innerHTML = '';

    const orbitalLevel = gameState.buildings.orbital_station || 0;
    if (!orbitalLevel || !gameState.researches.galactic_exploration) {
        container.innerHTML = '<p>Construiește o Stație Orbitală și cercetează Explorarea Galactică!</p>';
        return;
    }

    const missions = [
        { name: 'Câmp de Asteroizi', reward: { metal: 500, crystal: 200 }, difficulty: 1 },
        { name: 'Avanpost Inamic', reward: { helium: 300 }, difficulty: 2, enemy: { fleet: [{ attack: 100, hp: 200 }] } }
    ];

    missions.forEach((mission, index) => {
        const card = document.createElement('div');
        card.className = 'mission-card';
        card.innerHTML = `
            <h3>${mission.name}</h3>
            <p>Recompensa: ${Object.entries(mission.reward).map(([r, a]) => `${r}: ${a}`).join(', ')}</p>
            <button class="mission-button" data-index="${index}">Pornește Misiune</button>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.mission-button').forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            const mission = missions[index];
            if (!gameState.fleet.length) {
                showMessage('Ai nevoie de o flotă!', 'error');
                return;
            }

            if (mission.enemy) {
                const playerStrength = gameState.fleet.reduce((sum, ship) => sum + ship.attack, 0);
                const enemyStrength = mission.enemy.fleet.reduce((sum, ship) => sum + ship.attack, 0);
                if (playerStrength > enemyStrength) {
                    Object.entries(mission.reward).forEach(([res, amt]) => gameState.resources[res] += amt);
                    showMessage(`Misiune ${mission.name} reușită!`, 'success');
                } else {
                    gameState.fleet = [];
                    showMessage(`Misiune eșuată! Flota distrusă.`, 'error');
                }
            } else {
                Object.entries(mission.reward).forEach(([res, amt]) => gameState.resources[res] += amt);
                showMessage(`Misiune ${mission.name} reușită!`, 'success');
            }
            updateHUD();
            initializeMap();
        };
    });
}
