// public/js/hud.js

import { getUserData, updateResources } from './user.js';

/**
 * Updates the Head-Up Display (HUD) with current player information and resources.
 */
export function updateHUD() {
    const userData = getUserData();

    const playerNameElement = document.getElementById('player-name');
    const playerRaceElement = document.getElementById('player-race');
    const playerScoreElement = document.getElementById('player-score');

    if (playerNameElement) playerNameElement.textContent = userData.playerName;
    if (playerRaceElement) playerRaceElement.textContent = userData.playerRace;
    if (playerScoreElement) playerScoreElement.textContent = userData.score;

    // Afișează resursele și producția pe oră
    if (document.getElementById('resource-metal')) {
        document.getElementById('resource-metal').textContent = `${Math.floor(userData.resources.metal)} (+${Math.floor(userData.production.metal * 3600)}/h)`;
    }
    if (document.getElementById('resource-crystal')) {
        document.getElementById('resource-crystal').textContent = `${Math.floor(userData.resources.crystal)} (+${Math.floor(userData.production.crystal * 3600)}/h)`;
    }
    if (document.getElementById('resource-energy')) {
        document.getElementById('resource-energy').textContent = `${Math.floor(userData.resources.energy)} (${userData.production.energy >= 0 ? '+' : ''}${Math.floor(userData.production.energy * 3600)}/h)`;
    }
    if (document.getElementById('resource-helium')) {
        document.getElementById('resource-helium').textContent = `${Math.floor(userData.resources.helium)} (+${Math.floor(userData.production.helium * 3600)}/h)`;
    }
}

/**
 * Calculates and updates resources based on production buildings.
 * This runs every 30 seconds.
 */
function produceResources() {
    const userData = getUserData();
    const intervalSeconds = 30; // 30 de secunde

    // Adaugă producția acumulată în intervalul de 30 de secunde
    // Folosim updateResources pentru a asigura actualizarea HUD-ului și salvarea
    updateResources(
        userData.production.metal * intervalSeconds,
        userData.production.crystal * intervalSeconds,
        userData.production.energy * intervalSeconds,
        userData.production.helium * intervalSeconds
    );
    // console.log("Producție rulată la 30s. Resurse curente:", userData.resources);
}

/**
 * Sets up the interval for resource production.
 */
export function setupProductionInterval() {
    // Clear any existing interval to prevent multiple intervals running
    if (window.productionInterval) {
        clearInterval(window.productionInterval);
    }
    // Set a new interval for production every 30 seconds (30000 ms)
    window.productionInterval = setInterval(produceResources, 30000);
    // console.log("Interval de producție setat la 30 de secunde.");
}
