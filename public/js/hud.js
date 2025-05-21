// public/js/hud.js - Logică pentru Head-Up Display (HUD) și producția de resurse

import { getUserData, updateResources } from './user.js';

/**
 * Actualizează Head-Up Display (HUD) cu informațiile curente ale jucătorului și resurse.
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
 * Calculează și actualizează resursele pe baza clădirilor de producție.
 * Aceasta rulează la fiecare X secunde.
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
 * Setează intervalul pentru producția de resurse.
 */
export function setupProductionInterval() {
    // Curăță orice interval existent pentru a preveni multiple intervale să ruleze
    if (window.productionInterval) {
        clearInterval(window.productionInterval);
    }
    // Setează un nou interval pentru producție la fiecare 30 de secunde (30000 ms)
    window.productionInterval = setInterval(produceResources, 30000);
    // console.log("Interval de producție setat la 30 de secunde.");
}
