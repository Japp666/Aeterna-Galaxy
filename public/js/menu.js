// public/js/menu.js - Logică pentru meniul de navigare

// Importăm funcția loadComponent din main.js pentru a putea schimba tab-urile
import { loadComponent } from './main.js';
import { renderBuildings } from './buildings.js';
// Importă și alte funcții de randare pentru tab-urile tale (ex: fleet, research, map, shipyard)
import { renderFleet } from './fleet.js'; // Va trebui să creezi acest fișier și funcția
import { renderResearch } from './research.js'; // Va trebui să creezi acest fișier și funcția
import { renderMap } from './map.js'; // Va trebui să creezi acest fișier și funcția
// import { renderShipyard } from './shipyard.js'; // Dacă ai o funcție pentru shipyard

/**
 * Randarează meniul principal și adaugă event listener-ii necesari.
 * Această funcție este apelată după ce menu.html este încărcat în #main-menu.
 */
export function renderMenu() {
    const mainMenu = document.getElementById('main-menu');
    if (!mainMenu) {
        console.error("Elementul #main-menu nu a fost găsit pentru randarea meniului.");
        return;
    }

    // Funcție helper pentru a seta clasa 'active' pe butonul curent
    const setActiveButton = (activeButtonId) => {
        mainMenu.querySelectorAll('.menu-button').forEach(button => {
            if (button.id === activeButtonId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };

    // Adaugă event listeners pentru butoanele de meniu
    const btnBuildings = mainMenu.querySelector('#btn-buildings');
    if (btnBuildings) {
        btnBuildings.addEventListener('click', async () => {
            await loadComponent('tab-buildings', 'main-content');
            renderBuildings(); // Apelează funcția de randare a clădirilor
            setActiveButton('btn-buildings');
        });
    }

    const btnResearch = mainMenu.querySelector('#btn-research');
    if (btnResearch) {
        btnResearch.addEventListener('click', async () => {
            await loadComponent('tab-research', 'main-content');
            renderResearch(); // Presupune că ai o funcție renderResearch în research.js
            setActiveButton('btn-research');
        });
    }

    const btnFleet = mainMenu.querySelector('#btn-fleet');
    if (btnFleet) {
        btnFleet.addEventListener('click', async () => {
            await loadComponent('tab-fleet', 'main-content');
            renderFleet(); // Presupune că ai o funcție renderFleet în fleet.js
            setActiveButton('btn-fleet');
        });
    }

    const btnMap = mainMenu.querySelector('#btn-map');
    if (btnMap) {
        btnMap.addEventListener('click', async () => {
            await loadComponent('tab-map', 'main-content');
            renderMap(); // Presupune că ai o funcție renderMap în map.js
            setActiveButton('btn-map');
        });
    }

    const btnShipyard = mainMenu.querySelector('#btn-shipyard');
    if (btnShipyard) {
        btnShipyard.addEventListener('click', async () => {
            await loadComponent('tab-shipyard', 'main-content');
            // renderShipyard(); // Presupune că ai o funcție renderShipyard în shipyard.js
            setActiveButton('btn-shipyard');
        });
    }

    // Setează butonul "Clădiri" ca activ implicit la prima randare a meniului
    setActiveButton('btn-buildings');
}
