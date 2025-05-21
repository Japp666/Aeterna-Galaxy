// js/hud.js

import { getUserData, getPlayerName, getPlayerRace } from './user.js'; // Acum importăm getPlayerName și getPlayerRace direct

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
    if (document.getElementById('helium')) { // Asigură-te că există un element cu id="helium" în HTML
        document.getElementById('helium').textContent = Math.floor(userData.resources.helium);
    }
    document.getElementById('score').textContent = Math.floor(userData.score || 0); // Asigură-te că există un 'score' în userData

    // Actualizează producția pe oră
    document.getElementById('prod-metal').textContent = Math.floor(userData.production.metal);
    document.getElementById('prod-crystal').textContent = Math.floor(userData.production.crystal);
    document.getElementById('prod-energy').textContent = Math.floor(userData.production.energy);
    if (document.getElementById('prod-helium')) { // Asigură-te că există un element cu id="prod-helium" în HTML
        document.getElementById('prod-helium').textContent = Math.floor(userData.production.helium);
    }
}
