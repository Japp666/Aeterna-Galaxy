console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const resourcesDiv = document.querySelector('.resources');
    if (!resourcesDiv) {
        console.error('Resources div not found');
        return; // Stop retrying to prevent infinite loop
    }

    // Update resources
    document.getElementById('metal').textContent = `Metal: ${gameState.resources.metal}/1000`;
    document.getElementById('crystal').textContent = `Cristal: ${gameState.resources.crystal}/1000`;
    document.getElementById('helium').textContent = `Heliu: ${gameState.resources.helium}/500`;
    document.getElementById('energy').textContent = `Energie: ${gameState.resources.energy}/500`;

    // Update income
    document.getElementById('metal-income').textContent = `+${gameState.production.metal || 0}/h`;
    document.getElementById('crystal-income').textContent = `+${gameState.production.crystal || 0}/h`;
    document.getElementById('helium-income').textContent = `+${gameState.production.helium || 0}/h`;
    document.getElementById('energy-income').textContent = `+${gameState.production.energy || 0}/h`;

    // Update player info
    const playerName = document.getElementById('player-name');
    const playerRace = document.getElementById('player-race');
    if (playerName) {
        playerName.textContent = `Nume: ${gameState.player.nickname || 'Necunoscut'}`;
    }
    if (playerRace) {
        playerRace.textContent = `Rasă: ${gameState.player.race ? gameState.player.race.charAt(0).toUpperCase() + gameState.player.race.slice(1) : 'Neselectată'}`;
    }

    console.log('HUD updated successfully');
}
