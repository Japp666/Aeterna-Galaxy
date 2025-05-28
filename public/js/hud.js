console.log('hud.js loaded');

function updateHUD() {
    document.getElementById('metal').textContent = `Metal: ${Math.floor(gameState.player.resources.metal)}/${gameState.player.maxStorage.metal}`;
    document.getElementById('crystal').textContent = `Cristal: ${Math.floor(gameState.player.resources.crystal)}/${gameState.player.maxStorage.crystal}`;
    document.getElementById('helium').textContent = `Heliu: ${Math.floor(gameState.player.resources.helium)}/${gameState.player.maxStorage.helium}`;
    document.getElementById('energy').textContent = `Energie: ${Math.floor(gameState.player.resources.energy)}/${gameState.player.maxStorage.energy}`;
    document.getElementById('metal-income').textContent = `+${gameState.player.incomePerHour.metal}/h`;
    document.getElementById('crystal-income').textContent = `+${gameState.player.incomePerHour.crystal}/h`;
    document.getElementById('helium-income').textContent = `+${gameState.player.incomePerHour.helium}/h`;
    document.getElementById('energy-income').textContent = `+${gameState.player.incomePerHour.energy}/h`;
    document.getElementById('player-name').textContent = `Nume: ${gameState.player.name}`;
    document.getElementById('player-race').textContent = `Rasă: ${gameState.player.race}`;
}
