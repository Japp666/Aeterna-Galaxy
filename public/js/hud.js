import { getPlayer } from './user.js';

export function updateHUD() {
    console.log("Updating HUD...");
    const player = getPlayer();
    if (!player) return;

    const playerNameElement = document.getElementById('hud-player-name');
    const playerRaceElement = document.getElementById('hud-player-race');
    if (playerNameElement) playerNameElement.textContent = player.name || 'Nume Comandant';
    if (playerRaceElement) playerRaceElement.textContent = player.race || 'Rasă Necunoscută';

    const metalElement = document.getElementById('resource-metal');
    const crystalElement = document.getElementById('resource-crystal');
    const heliumElement = document.getElementById('resource-helium');
    const energyElement = document.getElementById('resource-energy');

    if (metalElement) metalElement.textContent = player.resources.metal.toLocaleString();
    if (crystalElement) crystalElement.textContent = player.resources.crystal.toLocaleString();
    if (heliumElement) heliumElement.textContent = player.resources.helium.toLocaleString();
    if (energyElement) energyElement.textContent = player.resources.energy.toLocaleString();
}
