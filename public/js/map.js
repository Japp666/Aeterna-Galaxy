// js/map.js

import { getPlayerName, getUserData } from './user.js';
import { showMessage } from './utils.js';

// Coordonatele mele (exemplu, ar trebui să vină din userData real)
const myCoords = { x: 5, y: 8 };

// Date simulate pentru alți jucători (pentru demonstrație)
const otherPlayers = [
    { name: "AlphaCommander", coords: { x: 1, y: 1 } },
    { name: "OmegaWarrior", coords: { x: 15, y: 10 } },
    { name: "StarExplorer", coords: { x: 7, y: 2 } },
    { name: "CosmicPirate", coords: { x: 18, y: 18 } }
];

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
            <input type="number" id="coord-x" placeholder="0" min="0" max="19">
            <label for="coord-y">Y:</label>
            <input type="number" id="coord-y" placeholder="0" min="0" max="19">
            <button id="search-coords-button">Cauta Coordonate</button>
            <input type="text" id="player-name-search-input" placeholder="Nume jucător">
            <button id="search-player-button">Cauta Jucător</button>
            <button id="reset-coords-button">Reset</button>
        </div>

        <div class="galaxy-display-area">
            <img src="https://i.postimg.cc/mrfgr13H/harta.jpg" alt="Hartă Galactică" class="galaxy-map-image"
                 onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
            <div class="map-overlay">
                <div id="highlight-box" class="highlight-box"></div>
                <div class="player-info-hover">
                    <p>Nume: <span id="hover-player-name"></span></p>
                    <p>Puncte: <span id="hover-player-score"></span></p>
                    <p>Coordonate: <span id="hover-coords">[0:0]</span></p>
                </div>
            </div>
        </div>
        `;
    mainContent.appendChild(mapContainer);

    // --- Logica pentru căutare coordonate ---
    const coordXInput = document.getElementById('coord-x');
    const coordYInput = document.getElementById('coord-y');
    const searchCoordsButton = document.getElementById('search-coords-button');
    const resetCoordsButton = document.getElementById('reset-coords-button');
    const highlightBox = document.getElementById('highlight-box');
    const galaxyDisplayArea = mapContainer.querySelector('.galaxy-display-area');

    // Căutare după nume jucător
    const playerNameSearchInput = document.getElementById('player-name-search-input');
    const searchPlayerButton = document.getElementById('search-player-button');

    searchCoordsButton.addEventListener('click', () => {
        const x = parseInt(coordXInput.value);
        const y = parseInt(coordYInput.value);

        if (isNaN(x) || isNaN(y) || x < 0 || x >= 20 || y < 0 || y >= 20) {
            showMessage("Te rog introdu coordonate numerice valide între 0 și 19.", "error");
            hideHighlightBox();
            return;
        }
        highlightCoordinates(x, y, (x === myCoords.x && y === myCoords.y) ? 'player' : 'other');
    });

    searchPlayerButton.addEventListener('click', () => {
        const searchedName = playerNameSearchInput.value.trim();
        if (!searchedName) {
            showMessage("Te rog introdu un nume de jucător.", "error");
            hideHighlightBox();
            return;
        }

        if (searchedName.toLowerCase() === getPlayerName().toLowerCase()) {
            highlightCoordinates(myCoords.x, myCoords.y, 'player');
            showMessage(`Am găsit locația ta: [${myCoords.x}:${myCoords.y}]`, "success");
        } else {
            const foundPlayer = otherPlayers.find(p => p.name.toLowerCase() === searchedName.toLowerCase());
            if (foundPlayer) {
                highlightCoordinates(foundPlayer.coords.x, foundPlayer.coords.y, 'other');
                showMessage(`Am găsit jucătorul ${foundPlayer.name} la [${foundPlayer.coords.x}:${foundPlayer.coords.y}]`, "info");
            } else {
                showMessage(`Jucătorul "${searchedName}" nu a fost găsit.`, "error");
                hideHighlightBox();
            }
        }
    });


    resetCoordsButton.addEventListener('click', () => {
        coordXInput.value = '';
        coordYInput.value = '';
        playerNameSearchInput.value = ''; // Resetează și inputul de nume
        hideHighlightBox();
        showMessage("Căutarea a fost resetată.", "info");
    });

    /**
     * Calculează poziția și dimensiunea chenarului roșu.
     * Presupunem o grilă de 20x20 celule (deci fiecare celulă e 5% din lățime/înălțime).
     * @param {number} x Coordonata X.
     * @param {number} y Coordonata Y.
     * @param {string} type Tipul chenarului ('player' pentru mine, 'other' pentru alți jucători).
     */
    function highlightCoordinates(x, y, type) {
        // Asigură-te că imaginea e încărcată pentru a obține dimensiunile corecte
        const mapImage = galaxyDisplayArea.querySelector('.galaxy-map-image');
        if (!mapImage.naturalWidth || !mapImage.naturalHeight) {
            mapImage.onload = () => _applyHighlight(x, y, type);
        } else {
            _applyHighlight(x, y, type);
        }
    }

    function _applyHighlight(x, y, type) {
        const mapWidth = galaxyDisplayArea.offsetWidth;
        const mapHeight = galaxyDisplayArea.offsetHeight;

        // Dimensiunea unei celule de grilă (5% din lățime/înălțime)
        const cellWidth = mapWidth / 20; // 20 celule orizontal (100% / 5%)
        const cellHeight = mapHeight / 20; // 20 celule vertical

        highlightBox.style.left = `${x * cellWidth}px`;
        highlightBox.style.top = `${y * cellHeight}px`;
        highlightBox.style.width = `${cellWidth}px`;
        highlightBox.style.height = `${cellHeight}px`;
        highlightBox.style.display = 'block';

        // Aplică clasa de stilizare în funcție de tip
        highlightBox.className = 'highlight-box'; // Resetează clasele
        if (type === 'player') {
            highlightBox.classList.add('player-coords');
        } else if (type === 'other') {
            highlightBox.classList.add('other-player-coords');
        }
    }

    function hideHighlightBox() {
        highlightBox.style.display = 'none';
        highlightBox.className = 'highlight-box'; // Resetează clasele
    }


    // --- Logica de Hover pentru hartă ---
    const playerInfoHover = mapContainer.querySelector('.player-info-hover');
    const hoverPlayerName = playerInfoHover.querySelector('#hover-player-name');
    const hoverPlayerScore = playerInfoHover.querySelector('#hover-player-score');
    const hoverCoords = playerInfoHover.querySelector('#hover-coords');

    galaxyDisplayArea.addEventListener('mousemove', (event) => {
        const rect = galaxyDisplayArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const mapWidth = galaxyDisplayArea.offsetWidth;
        const mapHeight = galaxyDisplayArea.offsetHeight;
        const gridX = Math.floor(x / (mapWidth / 20));
        const gridY = Math.floor(y / (mapHeight / 20));

        // Asigură-te că mouse-ul este în limitele grilei (0-19)
        if (gridX < 0 || gridX >= 20 || gridY < 0 || gridY >= 20) {
            playerInfoHover.style.display = 'none';
            return;
        }

        // Simulează informații despre jucător în funcție de coordonate
        let displayPlayerName = "Neexplorat";
        let displayPlayerScore = "N/A";
        let isOccupied = false;

        if (gridX === myCoords.x && gridY === myCoords.y) {
            displayPlayerName = getPlayerName();
            displayPlayerScore = getUserData().score;
            isOccupied = true;
        } else {
            const foundPlayer = otherPlayers.find(p => p.coords.x === gridX && p.coords.y === gridY);
            if (foundPlayer) {
                displayPlayerName = foundPlayer.name;
                // Simulează un scor pentru alți jucători
                displayPlayerScore = Math.floor(Math.random() * 10000) + 1000;
                isOccupied = true;
            }
        }

        hoverPlayerName.textContent = displayPlayerName;
        hoverPlayerScore.textContent = displayPlayerScore;
        hoverCoords.textContent = `[${gridX}:${gridY}]`;

        playerInfoHover.style.left = `${event.clientX + 10}px`;
        playerInfoHover.style.top = `${event.clientY + 10}px`;
        playerInfoHover.style.display = 'block';
    });

    galaxyDisplayArea.addEventListener('mouseleave', () => {
        playerInfoHover.style.display = 'none';
    });

    // Inițial, afișează chenarul pentru locația mea
    highlightCoordinates(myCoords.x, myCoords.y, 'player');
}
