// public/js/menu.js - Gestionează interacțiunile meniului și încărcarea conținutului tab-urilor

import { updateHUD } from './hud.js'; // Poate fi necesară pentru a actualiza HUD-ul după schimbarea tab-ului
import { getPlayer } from './user.js'; // Poate fi necesară pentru a accesa datele jucătorului
import { showMessage } from './utils.js'; // Pentru mesaje de notificare

// Funcția pentru a încărca conținutul HTML într-un element specific
// Aceasta este funcția pe care o vei exporta și o vei folosi în main.js și oriunde ai nevoie să schimbi tab-urile
export async function loadTabContent(tabId, targetElementId = 'main-content') {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
        console.error(`Elementul cu ID-ul "${targetElementId}" nu a fost găsit.`);
        return;
    }

    try {
        let filePath = '';
        switch (tabId) {
            case 'home':
                filePath = 'html/tab-home.html';
                break;
            case 'buildings':
                filePath = 'html/tab-buildings.html';
                break;
            case 'fleet':
                filePath = 'html/tab-fleet.html';
                break;
            case 'map':
                filePath = 'html/tab-map.html';
                break;
            case 'research':
                filePath = 'html/tab-research.html';
                break;
            case 'tutorial':
                filePath = 'html/tab-tutorial.html';
                break;
            case 'hud': // Acesta este un caz special, pentru a încărca HUD-ul
                filePath = 'html/hud.html';
                break;
            default:
                console.warn(`Tab ID necunoscut: ${tabId}`);
                targetElement.innerHTML = `<h2>Conținut pentru ${tabId} (în lucru)</h2><p>Acest tab este în construcție. Te rugăm să revii mai târziu.</p>`;
                return;
        }

        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Nu s-a putut încărca ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        targetElement.innerHTML = html;
        console.log(`Conținutul pentru ${tabId} încărcat în #${targetElementId}.`);

        // După încărcarea conținutului, inițializează logica specifică tab-ului
        // Acest switch va apela funcții de inițializare specifice
        switch (tabId) {
            case 'buildings':
                // Presupunem că ai o funcție initBuildings sau similar în buildings.js
                // Trebuie să o imporți și să o apelezi aici.
                // Exemplu: import { initBuildings } from './buildings.js';
                // initBuildings();
                console.log("Buildings tab loaded. Call initBuildings() if needed.");
                // Aici ar trebui să apelezi funcția de inițializare a clădirilor din buildings.js
                // Ex: import { initBuildingsPage } from './buildings.js'; initBuildingsPage();
                break;
            case 'fleet':
                // Similar pentru flotă
                console.log("Fleet tab loaded. Call initFleet() if needed.");
                break;
            case 'map':
                 console.log("Map tab loaded. Call initMap() if needed.");
                break;
            case 'research':
                 console.log("Research tab loaded. Call initResearch() if needed.");
                break;
            // Adaugă cazuri pentru alte tab-uri care necesită inițializare după încărcarea HTML-ului
        }

    } catch (error) {
        console.error("Eroare la încărcarea conținutului tab-ului:", error);
        targetElement.innerHTML = `<p style="color: red;">Eroare la încărcarea conținutului. ${error.message}</p>`;
        showMessage(`Eroare la încărcarea tab-ului ${tabId}.`, 'error');
    }
}

// Inițializarea meniului principal
document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.innerHTML = `
            <button data-tab="home">Acasă</button>
            <button data-tab="buildings">Clădiri</button>
            <button data-tab="fleet">Flotă</button>
            <button data-tab="map">Hartă</button>
            <button data-tab="research">Cercetare</button>
            <button data-tab="tutorial">Tutorial</button>
        `;

        mainMenu.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (button) {
                const tabId = button.dataset.tab;
                if (tabId) {
                    loadTabContent(tabId);
                    // Actualizează clasa "active" pentru butoanele meniului, dacă ai stiluri pentru asta
                    const currentActive = mainMenu.querySelector('.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    button.classList.add('active');
                }
            }
        });
    } else {
        console.error("Elementul #main-menu nu a fost găsit.");
    }
});
