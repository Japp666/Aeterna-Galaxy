// js/hud.js

import { getUserData } from './user.js'; // Import getUserData from user.js

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
 * This runs every second, but production is calculated per second.
 */
function produceResources() {
    const userData = getUserData();

    // Adaugă producția pe secundă (producția/oră / 3600 secunde/oră)
    userData.resources.metal += userData.production.metal;
    userData.resources.crystal += userData.production.crystal;
    userData.resources.energy += userData.production.energy;
    userData.resources.helium += userData.production.helium;

    // Ensure resources don't go below zero if energy consumption is high
    userData.resources.metal = Math.max(0, userData.resources.metal);
    userData.resources.crystal = Math.max(0, userData.resources.crystal);
    // Energia poate fi negativă, dar o limităm la o valoare minimă pentru a nu "sparge" jocul
    // De exemplu, dacă energia e -100, construcția s-ar putea opri, etc.
    // Deocamdată, o lăsăm să meargă negativ.
    userData.resources.helium = Math.max(0, userData.resources.helium);

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
    // Set a new interval for production every 1 second (1000 ms)
    window.productionInterval = setInterval(produceResources, 1000);
}
