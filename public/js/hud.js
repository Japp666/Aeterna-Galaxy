import { getPlayer } from './user.js';

export function updateHUD() {
    const player = getPlayer();
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

    metal.textContent = player.name;
    crystal.textContent = `Crystal: ${Math.floor(player.resources.crystal)}`;
    helium.textContent = `Helium: ${Math.floor(player.resources.helium)}`;
    energy.textContent = `Energy: ${Math.floor(player.resources.energy)}`;
    playerName.textContent = `Name: ${player.name || 'Unknown'}`;
    playerRace.textContent = `Race: ${player.race || 'Unselected'}`;
}
