// public/js/hud.js - Gestionează afișarea informațiilor din HUD

import { getPlayer } from './user.js'; // Importăm funcția corectă pentru a obține datele jucătorului

/**
 * Actualizează toate elementele din HUD cu datele curente ale jucătorului.
 */
export function updateHUD() {
    console.log("Updating HUD...");
    const player = getPlayer(); // Obținem obiectul jucătorului
    if (!player) {
        console.warn("Player data not available to update HUD.");
        return;
    }

    // Actualizează Numele Jucătorului și Rasa
    const playerNameElement = document.getElementById('hud-player-name');
    const playerRaceElement = document.getElementById('hud-player-race');

    if (playerNameElement) {
        playerNameElement.textContent = player.name || 'Nume Comandant';
    } else {
        console.warn("#hud-player-name not found.");
    }

    if (playerRaceElement) {
        playerRaceElement.textContent = player.race || 'Rasă Necunoscută';
    } else {
        console.warn("#hud-player-race not found.");
    }

    // Actualizează Resursele
    const energyElement = document.getElementById('resource-energy');
    const mineralsElement = document.getElementById('resource-minerals');
    const alloysElement = document.getElementById('resource-alloys');
    const foodElement = document.getElementById('resource-food');

    if (energyElement) {
        energyElement.textContent = player.resources.energy.toLocaleString();
    } else {
        console.warn("#resource-energy not found.");
    }
    if (mineralsElement) {
        mineralsElement.textContent = player.resources.minerals.toLocaleString();
    } else {
        console.warn("#resource-minerals not found.");
    }
    if (alloysElement) {
        alloysElement.textContent = player.resources.alloys.toLocaleString();
    } else {
        console.warn("#resource-alloys not found.");
    }
    if (foodElement) {
        foodElement.textContent = player.resources.food.toLocaleString();
    } else {
        console.warn("#resource-food not found.");
    }

    // Aici poți adăuga logica pentru a actualiza și alte elemente din HUD,
    // cum ar fi populația, limitele de resurse, etc., dacă le ai.
}

// Nu este necesară o apelare directă la updateHUD aici, deoarece main.js o gestionează.
document.addEventListener('DOMContentLoaded', () => {
    // În general, updateHUD() va fi apelat de main.js după ce player name/race sunt setate.
});
