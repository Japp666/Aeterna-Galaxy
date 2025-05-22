// public/js/hud.js
import { getPlayer } from './user.js';

export function updateHUD() {
    console.log("Updating HUD...");
    const player = getPlayer();
    if (!player) {
        console.warn("Player data not available to update HUD.");
        return;
    }

    const playerNameElement = document.getElementById('player-name');
    const playerRaceElement = document.getElementById('player-race');
    const metalElement = document.getElementById('resource-metal');
    const crystalElement = document.getElementById('resource-crystal');
    const energyElement = document.getElementById('resource-energy');
    const heliumElement = document.getElementById('resource-helium');

    if (playerNameElement) {
        playerNameElement.textContent = player.name || 'Nume Comandant';
    } else {
        console.warn("#player-name not found.");
    }

    if (playerRaceElement) {
        playerRaceElement.textContent = player.race || 'Rasă Necunoscută';
    } else {
        console.warn("#player-race not found.");
    }

    if (metalElement) {
        metalElement.textContent = `${player.resources.metal.toLocaleString()} (+${player.resourceRates?.metal || 0}/h)`;
    } else {
        console.warn("#resource-metal not found.");
    }
    if (crystalElement) {
        crystalElement.textContent = `${player.resources.crystal.toLocaleString()} (+${player.resourceRates?.crystal || 0}/h)`;
    } else {
        console.warn("#resource-crystal not found.");
    }
    if (energyElement) {
        energyElement.textContent = `${player.resources.energy.toLocaleString()} (+${player.resourceRates?.energy || 0}/h)`;
    } else {
        console.warn("#resource-energy not found.");
    }
    if (heliumElement) {
        heliumElement.textContent = `${player.resources.helium.toLocaleString()} (+${player.resourceRates?.helium || 0}/h)`;
    } else {
        console.warn("#resource-helium not found.");
    }
}
