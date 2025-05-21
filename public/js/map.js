// js/map.js

import { getPlayerName, getUserData } from './user.js'; // Importăm getUserData pentru puncte
import { showMessage } from './utils.js';

/**
 * Randareaza interfața hărții galactice.
 */
export function renderMap() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Curăță conținutul curent

    const mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';

    // Obținem datele jucătorului pentru a afișa informațiile
    const userData = getUserData();
    const playerName = getPlayerName() || 'Comandant Necunoscut';
    const playerScore = userData.score || 0; // Presupunând că ai un scor în userData

    mapContainer.innerHTML = `
        <h2>Harta Galactică a lui ${playerName}</h2>
        <p>Explorează galaxia și descoperă noi planete!</p>
        <div class="galaxy-display-area">
            <img src="/public/img/harta/00-harta.jpg" alt="Hartă Galactică" class="galaxy-map-image"
                 onerror="this.onerror=null;this.src='/public/img/placeholder.png';">
            <div class="map-overlay">
                <div class="player-info-hover" style="position: absolute; top: 10px; left: 10px;">
                    <p>Nume: ${playerName}</p>
                    <p>Puncte: ${playerScore}</p>
                    <p>Coordonate: [X:Y]</p>
                </div>
            </div>
        </div>
        <button id="explore-button">Explorează un Sector Nou</button>
    `;
    mainContent.appendChild(mapContainer);

    document.getElementById('explore-button').addEventListener('click', () => {
        showMessage("Sector nou explorat! Ai găsit resurse sau inamici.", "info");
        // Aici se poate adăuga logica pentru explorarea propriu-zisă
    });

    // Logica pentru hover-ul pe hartă și afișarea coordonatelor ar fi mai complexă
    // și ar implica un canvas sau div-uri suprapuse, dar pentru început, afișăm doar o informație statică.
    // Dacă vrei interacțiune reală, va fi necesară o nouă iterație.
}
