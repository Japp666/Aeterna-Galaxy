// js/map.js

import { getPlayerName } from './user.js'; // Acum importăm getPlayerName direct
import { showMessage } from './utils.js'; // Asigură-te că showMessage este importat

/**
 * Randareaza interfața hărții galactice.
 */
export function renderMap() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Curăță conținutul curent

    const mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';
    mapContainer.innerHTML = `
        <h2>Harta Galactică a lui ${getPlayerName()}</h2>
        <p>Explorează galaxia și descoperă noi planete!</p>
        <div class="galaxy-grid">
            </div>
        <button id="explore-button">Explorează un Sector Nou</button>
    `;
    mainContent.appendChild(mapContainer);

    document.getElementById('explore-button').addEventListener('click', () => {
        showMessage("Sector nou explorat! Ai găsit resurse sau inamici.", "info");
        // Aici se poate adăuga logica pentru explorarea propriu-zisă
    });

    // Exemplu simplu de generare a unor "stele" pe hartă
    const galaxyGrid = mapContainer.querySelector('.galaxy-grid');
    for (let i = 0; i < 25; i++) { // 5x5 grid
        const star = document.createElement('div');
        star.className = 'galaxy-star';
        star.textContent = `S-${i + 1}`;
        star.style.left = `${Math.random() * 90}%`;
        star.style.top = `${Math.random() * 90}%`;
        galaxyGrid.appendChild(star);
    }
}
