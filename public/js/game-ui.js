// js/game-ui.js - Gestionarea interfeței utilizatorului (tab-uri, navigare)

import { loadDashboardTabContent, initDashboardTab } from './dashboard-renderer.js';
import { loadTeamTabContent, initTeamTab } from './team.js';
import { loadRosterTabContent, initRosterTab } from './roster-renderer.js';


const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');

let activeTab = null; // Reține tab-ul activ curent pentru a evita reîncărcări inutile

/**
 * Inițializează elementele UI ale jocului, inclusiv navigarea prin tab-uri.
 */
export function initUI() {
    console.log("game-ui.js: initUI() - Inițializarea UI-ului jocului.");
    addMenuListeners();
    // La pornirea jocului, afișează tab-ul "Dashboard" implicit
    displayTab('dashboard');
    console.log("game-ui.js: initUI() - UI inițializat. Dashboard-ul ar trebui să fie activ.");
}

/**
 * Adaugă event listeneri pentru butoanele din meniu.
 */
function addMenuListeners() {
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabName = event.target.dataset.tab;
            console.log(`game-ui.js: Click pe butonul meniu: ${tabName}`);
            displayTab(tabName);
        });
    });
    console.log("game-ui.js: Listeneri de meniu adăugați.");
}

/**
 * Afișează conținutul unui tab specific.
 * @param {string} tabName - Numele tab-ului de afișat (e.g., 'dashboard', 'team').
 */
export async function displayTab(tabName) {
    console.log(`game-ui.js: displayTab() - Se încearcă afișarea tab-ului: ${tabName}. Tab activ curent: ${activeTab}`);

    // Dezactivează butonul tab-ului anterior și activează pe cel curent
    menuButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Verifică dacă tab-ul este deja activ pentru a evita reîncărcarea inutilă
    if (activeTab === tabName) {
        console.log(`game-ui.js: Tab-ul '${tabName}' este deja activ. Nu se reîncarcă.`);
        return;
    }

    activeTab = tabName; // Setează noul tab activ

    let contentLoader; // Funcția pentru a încărca HTML-ul
    let initializer;   // Funcția pentru a inițializa logica tab-ului

    switch (tabName) {
        case 'dashboard':
            contentLoader = loadDashboardTabContent;
            initializer = initDashboardTab;
            break;
        case 'team':
            contentLoader = loadTeamTabContent;
            initializer = initTeamTab;
            break;
        case 'roster':
             contentLoader = loadRosterTabContent; // Asigură-te că ai această funcție
             initializer = initRosterTab;       // Asigură-te că ai această funcție
             break;
        // Adaugă aici alte tab-uri pe măsură ce le implementezi
        case 'training':
        case 'finances':
        case 'fixtures':
        case 'standings':
        case 'scouting':
        case 'settings':
            gameContent.innerHTML = `<p class="under-construction">Tab-ul "${tabName}" este în construcție. Revino mai târziu!</p>`;
            console.log(`game-ui.js: Tab-ul '${tabName}' este în construcție.`);
            return;
        default:
            gameContent.innerHTML = `<p class="error-message">Tab necunoscut: ${tabName}</p>`;
            console.error(`game-ui.js: Tab necunoscut: ${tabName}`);
            return;
    }

    // Încarcă conținutul HTML și apoi inițializează logica tab-ului
    try {
        console.log(`game-ui.js: Se încearcă încărcarea conținutului pentru tab-ul '${tabName}'...`);
        const htmlContent = await contentLoader();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM.`);

        // Dă un scurt delay pentru a permite DOM-ului să se randeze
        // Apoi inițializează logica specifică tab-ului
        setTimeout(() => {
            console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}...`);
            initializer();
            console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
        }, 50); // Un delay scurt (50ms)
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}':`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}
