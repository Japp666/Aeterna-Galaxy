// public/js/main.js - Fișierul principal de inițializare și orchestrare

import { loadGame, saveGame, getPlayerName, getPlayerRace, resetGame } from './user.js';
import { showNameModal, showRaceSelectionScreen, showMessage } from './utils.js';
import { updateHUD, setupProductionInterval } from './hud.js';
import { renderMenu } from './menu.js';
import { renderBuildings } from './buildings.js';
// Importă și alte funcții de randare pentru tab-urile tale când le implementezi
import { renderFleet } from './fleet.js';
import { renderResearch } from './research.js';
import { renderMap } from './map.js';
// import { renderShipyard } from './shipyard.js'; // Dacă ai o funcție pentru shipyard

/**
 * Încarcă conținutul HTML al unei componente și îl inserează într-un element țintă.
 * @param {string} componentName Numele fișierului HTML din directorul 'components' (fără '.html').
 * @param {string} targetElementId ID-ul elementului HTML unde va fi inserat conținutul.
 * @returns {Promise<void>} O promisiune care se rezolvă când conținutul este încărcat.
 */
export async function loadComponent(componentName, targetElementId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Eroare la încărcarea componentei ${componentName}: ${response.statusText}`);
        }
        const html = await response.text();
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = html;
            // console.log(`Componenta ${componentName} încărcată în #${targetElementId}`);
        } else {
            console.error(`Elementul țintă cu ID-ul '${targetElementId}' nu a fost găsit pentru componenta '${componentName}'.`);
        }
    } catch (error) {
        console.error("Nu s-a putut încărca componenta:", error);
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = `<p style="color: red;">Eroare la încărcarea conținutului: ${error.message}</p>`;
        }
    }
}

/**
 * Funcția principală de inițializare a jocului.
 * Gestionează ordinea de încărcare a datelor, cererea numelui/rasei și setarea intervalelor.
 */
async function initializeGame() {
    loadGame(); // Încărcă datele jocului

    // Încarcă și randează elementele structurale permanente (HUD, Meniu)
    await loadComponent('hud', 'hud');
    updateHUD(); // Actualizează afișajul HUD-ului după încărcare

    await loadComponent('menu', 'main-menu');
    renderMenu(); // Apelează funcția de randare a meniului după ce HTML-ul este încărcat

    setupProductionInterval(); // Pornește producția de resurse

    // Verifică dacă numele și rasa sunt setate, afișând modalurile dacă este necesar
    if (!getPlayerName()) {
        await showNameModal(); // Așteaptă până când numele este introdus
    }
    if (!getPlayerRace()) {
        await showRaceSelectionScreen(); // Așteaptă până când rasa este selectată
    }

    // Încarcă tab-ul inițial (ex: Clădiri)
    await loadComponent('tab-buildings', 'main-content');
    renderBuildings(); // Apelează funcția de randare a clădirilor ODATĂ CE HTML-ul este în DOM

    // Adaugă event listeners pentru salvare automată la închiderea ferestrei/tab-ului
    window.addEventListener('beforeunload', saveGame);
}

// Pornește jocul când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', initializeGame);

// Exportăm loadComponent pentru a fi accesibilă din alte module (ex: menu.js)
// Deși importul direct este de preferat, acest export asigură compatibilitatea.
// Practica ideală ar fi ca menu.js să importe direct main.js și să apeleze loadComponent.
// Dar pentru simplitate și evitarea circular dependencies, o expunem aici.
// (Am modificat menu.js să importe direct loadComponent din main.js, deci acest export nu mai e strict necesar, dar nu strică)
