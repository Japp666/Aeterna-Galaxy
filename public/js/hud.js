// js/hud.js

import { getUserData, getPlayerName, getPlayerRace } from './user.js';

/**
 * Actualizează Head-Up Display (HUD) cu resursele și informațiile curente ale jucătorului.
 */
export function updateHUD() {
    const userData = getUserData(); // Obținem toate datele utilizatorului

    // Actualizează numele și rasa jucătorului folosind funcțiile dedicate
    document.getElementById('player-name').textContent = getPlayerName() || 'Comandant Necunoscut';
    document.getElementById('player-race').textContent = getPlayerRace() ? `Rasa: ${getPlayerRace()}` : 'Rasă: Nespecificată';

    // Actualizează resursele curente
    document.getElementById('metal').textContent = Math.floor(userData.resources.metal);
    document.getElementById('crystal').textContent = Math.floor(userData.resources.crystal);
    document.getElementById('energy').textContent = Math.floor(userData.resources.energy);
    document.getElementById('helium').textContent = Math.floor(userData.resources.helium); // Asigură-te că există un element cu id="helium" în HTML
    document.getElementById('score').textContent = Math.floor(userData.score || 0); // Asigură-te că există un 'score' în userData

    // Actualizează producția pe oră
    document.getElementById('prod-metal').textContent = Math.floor(userData.production.metal);
    document.getElementById('prod-crystal').textContent = Math.floor(userData.production.crystal);
    document.getElementById('prod-energy').textContent = Math.floor(userData.production.energy);
    document.getElementById('prod-helium').textContent = Math.floor(userData.production.helium); // Asigură-te că există un element cu id="prod-helium" în HTML
}
