console.log('hud.js loaded');

function updateHUD() {
    document.getElementById('metal').textContent = `Metal: ${gameState.player.resources.metal}`;
    document.getElementById('crystal').textContent = `Cristal: ${gameState.player.resources.crystal}`;
    document.getElementById('helium').textContent = `Heliu: ${gameState.player.resources.helium}`;
    document.getElementById('energy').textContent = `Energie: ${gameState.player.resources.energy}`;
    document.getElementById('player-name').textContent = `Nume: ${gameState.player.name}`;
    document.getElementById('player-race').textContent = `Rasă: ${gameState.player.race}`;
}
