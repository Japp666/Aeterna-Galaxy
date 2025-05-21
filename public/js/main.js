// js/main.js
import { loadGame, saveGame, getPlayerName, getPlayerRace } from './user.js';
import { showNameModal, showRaceSelectionScreen } from './utils.js';
import { updateHUD, setupProductionInterval } from './hud.js';
import { renderMenu } from './menu.js'; // Presupunând că ai o funcție renderMenu
import { renderBuildings } from './buildings.js'; // Importăm funcția de randare a clădirilor

// Funcție pentru a încărca conținut HTML dinamic
async function loadComponent(componentName, targetElementId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Eroare la încărcarea componentei ${componentName}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;
        console.log(`Componenta ${componentName} încărcată în #${targetElementId}`);
    } catch (error) {
        console.error("Nu s-a putut încărca componenta:", error);
        document.getElementById(targetElementId).innerHTML = `<p style="color: red;">Eroare la încărcarea conținutului: ${error.message}</p>`;
    }
}

// Funcția principală de inițializare a jocului
async function initializeGame() {
    loadGame(); // Încărcă datele jocului

    // Asigură-te că HUD-ul și meniul sunt randate inițial
    await loadComponent('hud', 'hud'); // Încarcă conținutul hud.html în #hud
    await loadComponent('menu', 'main-menu'); // Încarcă conținutul menu.html în #main-menu
    renderMenu(); // Apelează funcția de randare a meniului după ce HTML-ul este încărcat

    updateHUD(); // Actualizează afișajul HUD-ului
    setupProductionInterval(); // Pornește producția de resurse

    // Verifică dacă numele și rasa sunt setate
    if (!getPlayerName()) {
        await showNameModal(); // Așteaptă până când numele este introdus
    }
    if (!getPlayerRace()) {
        await showRaceSelectionScreen(); // Așteaptă până când rasa este selectată
    }

    // Aici vom seta componenta inițială (ex: clădirile)
    // Presupunem că meniul are o logică pentru a schimba tab-urile.
    // Pentru a începe cu clădirile, putem forța încărcarea lor.
    await loadComponent('tab-buildings', 'main-content'); // Încarcă tab-buildings.html în #main-content
    renderBuildings(); // Apelează funcția de randare a clădirilor ODATĂ CE HTML-ul este în DOM

    // Adaugă event listeners pentru salvare automată la închiderea ferestrei/tab-ului
    window.addEventListener('beforeunload', saveGame);
}

// Pornește jocul când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', initializeGame);

// Expunem funcții globale dacă e necesar, de exemplu pentru butoanele din HTML care nu sunt parte din module
// window.someGlobalFunction = someGlobalFunction;
