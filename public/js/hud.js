console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const elements = {
        metal: document.getElementById('metal'),
        metalIncome: document.getElementById('metal-amount'),
        crystal: document.getElementById('crystal'),
        crystalIncome: document.getElementById('crystal-amount'),
        helium: document.getElementById('helium'),
        heliumIncome: document.getElementById('helium-amount'),
        energy: document.getElementById('energy'),
        energyIncome: document.getElementById('energy-amount'),
        playerName: document.getElementById('player-name'),
        playerRace: document.getElementById('player-race'),
        playerCoords: document.getElementById('player-coords')
    };

    if (Object.values(elements).some(el => !el)) {
        console.warn('Some HUD elements are missing, skipping update');
        return;
    }

    elements.metal.textContent = `Metal: ${Math.floor(gameState.resources.metal)}/100000`;
    elements.metalIncome.textContent = `+${Math.floor(gameState.production.metal * (gameState.raceBonus.metal || 1))}/h`;
    elements.crystal.textContent = `Cristal: ${Math.floor(gameState.resources.crystal)}/100000`;
    elements.crystalIncome.textContent = `+${Math.floor(gameState.production.crystal * (gameState.raceBonus.crystal || 1))}/h`;
    elements.helium.textContent = `Heliu: ${Math.floor(gameState.resources.helium)}/50000`;
    elements.heliumIncome.textContent = `+${Math.floor(gameState.production.helium * (gameState.raceBonus.helium || 1))}/h`;
    elements.energy.textContent = `Energie: ${Math.floor(gameState.resources.energy)}/50000`;
    elements.energyIncome.textContent = `+${Math.floor(gameState.production.energy * (gameState.raceBonus.energy || 1))}/h`;
    elements.playerName.textContent = `Nume: ${gameState.player.nickname || 'Necunoscut'}`;
    elements.playerRace.textContent = `Rasă: ${gameState.player.race || 'Nesetată'}`;
    elements.playerCoords.textContent = `Coordonate: (${gameState.player.coords.x || 0}, ${gameState.player.coords.y || 0})`;
}
