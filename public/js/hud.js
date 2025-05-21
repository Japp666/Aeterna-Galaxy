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

    document.getElementById('resource-metal').textContent = userData.resources.metal;
    document.getElementById('resource-crystal').textContent = userData.resources.crystal;
    document.getElementById('resource-energy').textContent = userData.resources.energy;
    document.getElementById('resource-helium').textContent = userData.resources.helium;
}

/**
 * Calculates and updates resources based on production buildings.
 */
function produceResources() {
    const userData = getUserData();
    //console.log("Producing resources..."); // Debugging line

    // Calculate total production for all resources
    const metalProduction = userData.production.metal || 0;
    const crystalProduction = userData.production.crystal || 0;
    const energyProduction = userData.production.energy || 0;
    const heliumProduction = userData.production.helium || 0;

    // Apply production to current resources
    userData.resources.metal += metalProduction;
    userData.resources.crystal += crystalProduction;
    userData.resources.energy += energyProduction;
    userData.resources.helium += heliumProduction;

    // Ensure resources don't go below zero if energy consumption is high
    userData.resources.metal = Math.max(0, userData.resources.metal);
    userData.resources.crystal = Math.max(0, userData.resources.crystal);
    userData.resources.energy = Math.max(0, userData.resources.energy);
    userData.resources.helium = Math.max(0, userData.resources.helium);

    // Update HUD after production
    updateHUD();
}

/**
 * Sets up the interval for resource production.
 */
export function setupProductionInterval() { // <--- Added 'export' here
    // Clear any existing interval to prevent multiple intervals running
    if (window.productionInterval) {
        clearInterval(window.productionInterval);
    }
    // Set a new interval for production every 1 second (1000 ms) for faster testing
    window.productionInterval = setInterval(produceResources, 1000);
}
