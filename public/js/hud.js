import { getPlayer } from './user.js';

export function updateHUD() {
    console.log("Updating HUD...");
    const player = getPlayer();

    const nameElement = document.getElementById('player-name');
    if (nameElement) {
        nameElement.textContent = player.name || 'Unknown';
    } else {
        console.warn("#player-name not found.");
    }

    const raceElement = document.getElementById('player-race');
    if (raceElement) {
        raceElement.textContent = player.race || 'No Race';
    } else {
        console.warn("#player-race not found.");
    }

    const metalElement = document.getElementById('resource-metal');
    if (metalElement) {
        metalElement.textContent = player.resources.metal || 0;
    } else {
        console.warn("#resource-metal not found.");
    }

    const crystalElement = document.getElementById('resource-crystal');
    if (crystalElement) {
        crystalElement.textContent = player.resources.crystal || 0;
    } else {
        console.warn("#resource-crystal not found.");
    }

    const energyElement = document.getElementById('resource-energy');
    if (energyElement) {
        energyElement.textContent = player.resources.energy || 0;
    } else {
        console.warn("#resource-energy not found.");
    }

    const heliumElement = document.getElementById('resource-helium');
    if (heliumElement) {
        heliumElement.textContent = player.resources.helium || 0;
    } else {
        console.warn("#resource-helium not found.");
    }
}
