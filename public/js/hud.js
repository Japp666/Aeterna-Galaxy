console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const resources = gameState.resources || {};
    const production = gameState.production || {};
    const player = gameState.player || {};

    document.getElementById('metal').textContent = `Metal: ${Math.floor(resources.metal || 0)}/100000`;
    document.getElementById('metal-income').textContent = `+${Math.floor(production.metal || 0)}/h`;
    document.getElementById('crystal').textContent = `Cristal: ${Math.floor(resources.crystal || 0)}/100000`;
    document.getElementById('crystal-income').textContent = `+${Math.floor(production.crystal || 0)}/h`;
    document.getElementById('helium').textContent = `Heliu: ${Math.floor(resources.helium || 0)}/50000`;
    document.getElementById('helium-income').textContent = `+${Math.floor(production.helium || 0)}/h`;
    document.getElementById('energy').textContent = `Energie: ${Math.floor(resources.energy || 0)}/50000`;
    document.getElementById('energy-income').textContent = `+${Math.floor(production.energy || 0)}/h`;
    document.getElementById('player-name').textContent = `Nume: ${player.nickname || 'Necunoscut'}`;
    document.getElementById('player-race').textContent = `Rasă: ${player.race || 'Neselectată'}`;
    document.getElementById('player-coords').textContent = `Coordonate: (${player.coords?.x || 0}, ${player.coords?.y || 0})`;
}
