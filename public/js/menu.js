// public/js/menu.js - Gestionează interacțiunile meniului și încărcarea conținutului tab-urilor

import { updateHUD } from './hud.js';
import { getPlayer } from './user.js';
import { showMessage } from './utils.js';

// Importă funcțiile de inițializare pentru fiecare tab
import { initBuildingsPage } from './buildings.js';
import { initFleetPage } from './fleet.js';
import { initMapPage } from './map.js';
import { initResearchPage } from './research.js';
import { initTutorialPage } from './tutorial.js';

/**
 * Încarcă conținutul HTML într-un element specific și inițializează logica specifică tab-ului.
 * @param {string} tabId ID-ul tab-ului (e.g., 'home', 'buildings').
 * @param {string} targetElementId ID-ul elementului HTML unde va fi încărcat conținutul (default 'main-content').
 */
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
        switch (tabId) {
            case 'buildings':
                initBuildingsPage(); // Apeleză funcția de inițializare din buildings.js
                break;
            case 'fleet':
                initFleetPage(); // Apeleză funcția de inițializare din fleet.js
                break;
            case 'map':
                initMapPage(); // Apeleză funcția de inițializare din map.js
                break;
            case 'research':
                initResearchPage(); // Apeleză funcția de inițializare din research.js
                break;
            case 'tutorial':
                initTutorialPage(); // Apeleză funcția de inițializare din tutorial.js
                break;
            // Nu este necesar un apel pentru 'home' sau 'hud' aici, deoarece acestea sunt gestionate în main.js sau nu necesită logică suplimentară imediat după încărcare.
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
