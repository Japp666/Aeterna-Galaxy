// public/js/main.js

import { loadGame, saveGame, getPlayerName, getPlayerRace, resetGame } from './user.js';
import { showNameModal, showRaceSelectionScreen, showMessage } from './utils.js';
import { updateHUD, setupProductionInterval } from './hud.js';
import { renderMenu } from './menu.js';
import { renderBuildings } from './buildings.js';
// Importă și alte funcții de randare pentru tab-urile tale (fleet, research, map, etc.)
// import { renderFleet } from './fleet.js';
// import { renderResearch } from './research.js';
// import { renderMap } from './map.js';

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
    renderMenu(loadComponent); // Transmitem loadComponent către renderMenu pentru a putea schimba tab-urile

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

// Expunem funcții globale dacă e necesar, de exemplu pentru butoanele din HTML care nu sunt parte din module
// Exemplu: dacă ai un buton de reset în index.html și vrei să apelezi resetGame()
// window.resetGame = resetGame;
