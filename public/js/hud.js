export function updateHUD(player) {
    const metal = document.getElementById('metal');
    const crystal = document.getElementById('crystal');
    const helium = document.getElementById('helium');
    const energy = document.getElementById('energy');
    const playerName = document.getElementById('player-name');
    const playerRace = document.getElementById('player-race');

    if (!metal || !crystal || !helium || !energy || !playerName || !playerRace) {
        console.error('Elementele HUD nu au fost găsite.');
        return;
    }

    metal.textContent = `Metal: ${Math.floor(player.resources.metal)}`;
    crystal.textContent = `Cristal: ${Math.floor(player.resources.crystal)}`;
    helium.textContent = `Heliu: ${Math.floor(player.resources.helium)}`;
    energy.textContent = `Energie: ${Math.floor(player.resources.energy)}`;
    playerName.textContent = `Nume: ${player.name || 'Necunoscut'}`;
    playerRace.textContent = `Rasă: ${player.race || 'Neselectată'}`;

    console.log('Updating HUD:', player.resources);
}
