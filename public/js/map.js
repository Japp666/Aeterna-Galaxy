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

        <div class="coords-input-container">
            <label for="coord-x">X:</label>
            <input type="number" id="coord-x" placeholder="0" min="0">
            <label for="coord-y">Y:</label>
            <input type="number" id="coord-y" placeholder="0" min="0">
            <button id="search-coords-button">Cauta</button>
            <button id="reset-coords-button">Reset</button>
        </div>

        <div class="galaxy-display-area">
            <img src="https://i.postimg.cc/mrfgr13H/harta.jpg" alt="Hartă Galactică" class="galaxy-map-image"
                 onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
            <div class="map-overlay">
                <div id="highlight-box" class="highlight-box"></div>
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

    // --- Logica pentru căutare coordonate ---
    const coordXInput = document.getElementById('coord-x');
    const coordYInput = document.getElementById('coord-y');
    const searchCoordsButton = document.getElementById('search-coords-button');
    const resetCoordsButton = document.getElementById('reset-coords-button');
    const highlightBox = document.getElementById('highlight-box');
    const galaxyDisplayArea = mapContainer.querySelector('.galaxy-display-area');

    searchCoordsButton.addEventListener('click', () => {
        const x = parseInt(coordXInput.value);
        const y = parseInt(coordYInput.value);

        if (isNaN(x) || isNaN(y)) {
            showMessage("Te rog introdu coordonate numerice valide.", "error");
            return;
        }

        // Asigură-te că imaginea e încărcată pentru a obține dimensiunile corecte
        const mapImage = galaxyDisplayArea.querySelector('.galaxy-map-image');
        if (!mapImage.naturalWidth || !mapImage.naturalHeight) {
            mapImage.onload = () => highlightCoordinates(x, y, mapImage, highlightBox);
        } else {
            highlightCoordinates(x, y, mapImage, highlightBox);
        }
    });

    resetCoordsButton.addEventListener('click', () => {
        coordXInput.value = '';
        coordYInput.value = '';
        highlightBox.style.display = 'none';
        highlightBox.style.width = '0';
        highlightBox.style.height = '0';
        highlightBox.style.left = '0';
        highlightBox.style.top = '0';
        showMessage("Chenarul de căutare a fost resetat.", "info");
    });

    /**
     * Calculează poziția și dimensiunea chenarului roșu.
     * Presupunem o grilă de 20x20 celule (deci fiecare celulă e 5% din lățime/înălțime).
     * @param {number} x Coordonata X.
     * @param {number} y Coordonata Y.
     * @param {HTMLImageElement} mapImage Elementul imagine al hărții.
     * @param {HTMLElement} highlightBox Elementul chenarului de evidențiere.
     */
    function highlightCoordinates(x, y, mapImage, highlightBox) {
        const mapWidth = mapImage.offsetWidth;
        const mapHeight = mapImage.offsetHeight;

        // Dimensiunea unei celule de grilă (5% din lățime/înălțime)
        const cellWidth = mapWidth / 20; // 20 celule orizontal (100% / 5%)
        const cellHeight = mapHeight / 20; // 20 celule vertical

        // Validare limite coordonate (presupunem 0-19 pentru X și Y)
        if (x < 0 || x >= 20 || y < 0 || y >= 20) {
            showMessage("Coordonatele X și Y trebuie să fie între 0 și 19.", "error");
            highlightBox.style.display = 'none';
            return;
        }

        // Calculează poziția chenarului
        highlightBox.style.left = `${x * cellWidth}px`;
        highlightBox.style.top = `${y * cellHeight}px`;
        highlightBox.style.width = `${cellWidth}px`;
        highlightBox.style.height = `${cellHeight}px`;
        highlightBox.style.display = 'block';

        showMessage(`Locația [${x}:${y}] a fost evidențiată.`, "success");
    }


    // --- Logica de Hover pentru hartă (Exemplu simplu) ---
    const playerInfoHover = mapContainer.querySelector('.player-info-hover');
    const hoverCoords = playerInfoHover.querySelector('#hover-coords');

    galaxyDisplayArea.addEventListener('mousemove', (event) => {
        // Obține poziția mouse-ului relativ la elementul galaxyDisplayArea
        const rect = galaxyDisplayArea.getBoundingClientRect();
        const x = event.clientX - rect.left; // Coordonata X relativă în pixeli
        const y = event.clientY - rect.top;  // Coordonata Y relativă în pixeli

        // Calculează coordonatele grilei (0-19)
        const mapWidth = galaxyDisplayArea.offsetWidth;
        const mapHeight = galaxyDisplayArea.offsetHeight;
        const gridX = Math.floor(x / (mapWidth / 20));
        const gridY = Math.floor(y / (mapHeight / 20));


        // Poziționează fereastra de informații lângă cursor
        playerInfoHover.style.left = `${event.clientX + 10}px`; // 10px offset de la cursor
        playerInfoHover.style.top = `${event.clientY + 10}px`; // 10px offset de la cursor
        playerInfoHover.style.display = 'block';
        playerInfoHover.style.position = 'fixed'; // Folosim fixed pentru a urmări cursorul pe ecran, nu doar în container


        // Actualizează coordonatele afișate în grid
        hoverCoords.textContent = `[${gridX}:${gridY}]`;
        // Poți adăuga și logică pentru a schimba numele/scorul în funcție de sector, dacă ai date pentru asta.
    });

    galaxyDisplayArea.addEventListener('mouseleave', () => {
        playerInfoHover.style.display = 'none'; // Ascunde fereastra la ieșirea din zonă
    });
}
