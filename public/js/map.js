// js/map.js

import { getPlayerName, getUserData } from './user.js';
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
    const playerScore = userData.score || 0;

    mapContainer.innerHTML = `
        <h2>Harta Galactică a lui ${playerName}</h2>
        <p>Explorează galaxia și descoperă noi planete!</p>
        <div class="galaxy-display-area">
            <img src="/public/img/harta/00-harta.jpg" alt="Hartă Galactică" class="galaxy-map-image"
                 onerror="this.onerror=null;this.src='/public/img/placeholder.png';">
            <div class="map-overlay">
                <div class="player-info-hover" style="position: absolute; top: 10px; left: 10px; display: none;">
                    <p>Nume: <span id="hover-player-name">${playerName}</span></p>
                    <p>Puncte: <span id="hover-player-score">${playerScore}</span></p>
                    <p>Coordonate: <span id="hover-coords">[0:0]</span></p>
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

    // --- Logica de Hover pentru hartă (Exemplu simplu) ---
    const galaxyDisplayArea = mapContainer.querySelector('.galaxy-display-area');
    const playerInfoHover = mapContainer.querySelector('.player-info-hover');
    const hoverCoords = playerInfoHover.querySelector('#hover-coords');

    galaxyDisplayArea.addEventListener('mousemove', (event) => {
        // Obține poziția mouse-ului relativ la elementul galaxyDisplayArea
        const rect = galaxyDisplayArea.getBoundingClientRect();
        const x = Math.floor(event.clientX - rect.left); // Coordonata X relativă
        const y = Math.floor(event.clientY - rect.top);  // Coordonata Y relativă

        // Poziționează fereastra de informații lângă cursor
        playerInfoHover.style.left = `${x + 10}px`; // 10px offset
        playerInfoHover.style.top = `${y + 10}px`; // 10px offset
        playerInfoHover.style.display = 'block';

        // Actualizează coordonatele afișate
        hoverCoords.textContent = `[${x}:${y}]`;
        // Poți adăuga și logică pentru a schimba numele/scorul în funcție de sector, dacă ai date pentru asta.
    });

    galaxyDisplayArea.addEventListener('mouseleave', () => {
        playerInfoHover.style.display = 'none'; // Ascunde fereastra la ieșirea din zonă
    });
}
