console.log('hud.js loaded');

function updateHUD(attempts = 0, maxAttempts = 10) {
    console.log('Updating HUD');
    const hud = document.getElementById('hud');
    if (!hud) {
        if (attempts < maxAttempts) {
            console.warn(`HUD missing (attempt ${attempts + 1})`);
            setTimeout(() => updateHUD(attempts + 1), 100);
        } else {
            console.error('HUD not found');
        }
        return;
    }

    const resources = [
        { id: 'metal', key: 'metal', rate: 10 },
        { id: 'crystal', key: 'crystal', rate: 0 },
        { id: 'helium', key: 'helium', rate: 0 },
        { id: 'energy', key: 'energy', rate: 0 },
        { id: 'research', key: 'research', rate: 0 }
    ];

    resources.forEach(({ id, key, rate }) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = `${Math.floor(gameState.resources[key] || 0)} (+${rate}/h)`;
        } else {
            console.warn(`Element #${id} missing`);
        }
    });

    const playerInfo = document.getElementById('player-info');
    if (playerInfo) {
        playerInfo.textContent = `Player: ${gameState.player.nickname || 'Unknown'} | Race: ${gameState.player.race || 'None'} | Coords: (${gameState.player.coords.join(',')})`;
    } else {
        console.warn('Player info element missing');
    }

    console.log('HUD updated:', gameState.resources);
}
