console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const resourcesDiv = document.querySelector('.resources');
    if (!resourcesDiv) {
        console.error('Resources div not found');
        return;
    }

    document.getElementById('metal').textContent = `Metal: ${Math.floor(gameState.resources.metal)}/10000`;
    document.getElementById('crystal').textContent = `Cristal: ${Math.floor(gameState.resources.crystal)}/10000`;
    document.getElementById('helium').textContent = `Heliu: ${Math.floor(gameState.resources.helium)}/5000`;
    document.getElementById('energy').textContent = `Energie: ${Math.floor(gameState.resources.energy)}/5000`;
    document.getElementById('research').textContent = `Cercetare: ${Math.floor(gameState.resources.research)}`;

    document.getElementById('metal-income').textContent = `+${Math.floor(gameState.production.metal)}/h`;
    document.getElementById('crystal-income').textContent = `+${Math.floor(gameState.production.crystal)}/h`;
    document.getElementById('helium-income').textContent = `+${Math.floor(gameState.production.helium)}/h`;
    document.getElementById('energy-income').textContent = `+${Math.floor(gameState.production.energy)}/h`;
    document.getElementById('research-income').textContent = `+${Math.floor(gameState.production.research)}/h`;

    const playerName = document.getElementById('player-name');
    const playerRace = document.getElementById('player-race');
    if (playerName) playerName.textContent = `Nume: ${gameState.player.nickname || 'Necunoscut'}`;
    if (playerRace) playerRace.textContent = `Rasă: ${gameState.player.race ? gameState.player.race.charAt(0).toUpperCase() + gameState.player.race.slice(1) : 'Neselectată'}`;
    console.log('HUD updated successfully');
}
