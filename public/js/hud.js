console.log('hud.js loaded successfully');

function updateHUD(player) {
    console.log('Updating HUD:', player);
    document.getElementById('metal').textContent = `Metal: ${Math.floor(player.resources.metal)}`;
    document.getElementById('crystal').textContent = `Cristal: ${Math.floor(player.resources.crystal)}`;
    document.getElementById('helium').textContent = `Heliu: ${Math.floor(player.resources.helium)}`;
    document.getElementById('energy').textContent = `Energie: ${Math.floor(player.resources.energy)}`;
    document.getElementById('player-name').textContent = `Nume: ${player.name || 'Necunoscut'}`;
    document.getElementById('player-race').textContent = `Rasă: ${player.race || 'Neselectată'}`;
}

window.updateHUD = updateHUD;
