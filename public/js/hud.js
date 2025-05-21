// js/hud.js

// Importăm doar getUserData din user.js, deoarece acesta conține toate informațiile necesare
import { getUserData } from './user.js';

/**
 * Actualizează Head-Up Display (HUD) cu resursele și informațiile curente ale jucătorului.
 */
export function updateHUD() {
    const userData = getUserData(); // Obținem toate datele utilizatorului

    // Actualizează numele și rasa jucătorului
    document.getElementById('player-name').textContent = userData.playerName || 'Comandant Necunoscut';
    document.getElementById('player-race').textContent = userData.playerRace ? `Rasa: ${userData.playerRace}` : 'Rasă: Nespecificată';

    // Actualizează resursele curente
    document.getElementById('metal').textContent = Math.floor(userData.resources.metal);
    document.getElementById('crystal').textContent = Math.floor(userData.resources.crystal);
    document.getElementById('energy').textContent = Math.floor(userData.resources.energy);
    // Asigură-te că și heliului este afișat dacă ai un element HTML pentru el
    // if (document.getElementById('helium')) { // Adaugă un span cu id="helium" în index.html dacă vrei să-l afișezi
    //     document.getElementById('helium').textContent = Math.floor(userData.resources.helium);
    // }
    document.getElementById('score').textContent = Math.floor(userData.score || 0); // Asigură-te că există un 'score' în userData

    // Actualizează producția pe oră
    document.getElementById('prod-metal').textContent = Math.floor(userData.production.metal);
    document.getElementById('prod-crystal').textContent = Math.floor(userData.production.crystal);
    document.getElementById('prod-energy').textContent = Math.floor(userData.production.energy);
    // if (document.getElementById('prod-helium')) { // Adaugă un span cu id="prod-helium" dacă vrei să-l afișezi
    //     document.getElementById('prod-helium').textContent = Math.floor(userData.production.helium);
    // }
}
