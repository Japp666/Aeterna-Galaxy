// js/hud.js

import { getUserData } from './user.js';

/**
 * Updates the Head-Up Display (HUD) with current player information and resources.
 */
export function updateHUD() {
    const userData = getUserData();

    document.getElementById('player-name').textContent = userData.playerName;
    document.getElementById('player-race').textContent = userData.playerRace;
    document.getElementById('player-score').textContent = userData.score;

    // Afișează resursele și producția pe oră
    document.getElementById('resource-metal').textContent = `${Math.floor(userData.resources.metal)} (+${Math.floor(userData.production.metal * 3600)}/h)`; // Producția pe oră
    document.getElementById('resource-crystal').textContent = `${Math.floor(userData.resources.crystal)} (+${Math.floor(userData.production.crystal * 3600)}/h)`;
    document.getElementById('resource-energy').textContent = `${Math.floor(userData.resources.energy)} (${userData.production.energy >= 0 ? '+' : ''}${Math.floor(userData.production.energy * 3600)}/h)`; // Energie poate fi negativă
    document.getElementById('resource-helium').textContent = `${Math.floor(userData.resources.helium)} (+${Math.floor(userData.production.helium * 3600)}/h)`;
}

/**
 * Calculates and updates resources based on production buildings.
 * This runs every 30 seconds.
 */
function produceResources() {
    const userData = getUserData();
    const intervalSeconds = 30; // 30 de secunde

    // Adaugă producția acumulată în intervalul de 30 de secunde
    userData.resources.metal += userData.production.metal * intervalSeconds;
    userData.resources.crystal += userData.production.crystal * intervalSeconds;
    userData.resources.energy += userData.production.energy * intervalSeconds;
    userData.resources.helium += userData.production.helium * intervalSeconds;

    // Ensure resources don't go below zero if energy consumption is high
    userData.resources.metal = Math.max(0, userData.resources.metal);
    userData.resources.crystal = Math.max(0, userData.resources.crystal);
    userData.resources.helium = Math.max(0, userData.resources.helium);

    // Energia poate merge negativ
    // userData.resources.energy = Math.max(0, userData.resources.energy); // Păstrăm posibilitatea de energie negativă

    updateHUD();
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
}
