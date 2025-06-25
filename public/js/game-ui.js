// public/js/game-ui.js

import { loadDashboardTabContent, initDashboardTab } from './dashboard-renderer.js';
import { loadTeamTabContent, initTeamTab } from './team.js';
import { loadRosterTabContent, initRosterTab, renderRoster } from './roster-renderer.js'; // Adaugat renderRoster
// Nu importăm acum loadRosterTabContent direct aici, se va face dinamic

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');

let activeTab = null;

export function initUI() {
    console.log("game-ui.js: initUI() - Inițializarea UI-ului jocului.");
    addMenuListeners();
    // La inițializare, dacă jocul e pornit, afișăm dashboard-ul
    displayTab('dashboard'); // Apelul a fost mutat aici pentru a fi sigur
    console.log("game-ui.js: UI inițializat. Se afișează dashboard-ul.");
}

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

export async function displayTab(tabName) {
    console.log(`game-ui.js: displayTab() - Se încearcă afișarea tab-ului: ${tabName}. Tab activ curent: ${activeTab}`);

    menuButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    if (activeTab === tabName) {
        console.log(`game-ui.js: Tab-ul '${tabName}' este deja activ. Nu se reîncarcă.`);
        return;
    }

    activeTab = tabName;

    let contentLoader = null; // Funcția care încarcă HTML-ul
    let initializer = null;   // Funcția care inițializează logica JS a tab-ului
    let htmlFileName = '';    // Numele fișierului HTML din components/

    switch (tabName) {
        case 'dashboard':
            htmlFileName = 'dashboard.html';
            contentLoader = loadDashboardTabContent;
            initializer = initDashboardTab;
            break;
        case 'team':
            htmlFileName = 'team.html';
            contentLoader = loadTeamTabContent;
            initializer = initTeamTab;
            break;
        case 'roster':
            htmlFileName = 'roster-tab.html'; // Presupunem că vei crea acest fișier
            contentLoader = loadRosterTabContent;
            initializer = initRosterTab;
            break;
        case 'training':
            htmlFileName = 'training.html';
            break;
        case 'finances':
            htmlFileName = 'finance.html';
            break;
        case 'fixtures':
            htmlFileName = 'matches.html'; // Meciuri (corespunde cu matches.html)
            break;
        case 'standings':
            htmlFileName = 'standings.html';
            break;
        case 'scouting': // Transferuri (corespunde cu transfers.html)
            htmlFileName = 'transfers.html';
            break;
        case 'settings':
            // Pentru tab-uri fără fișier HTML dedicat sau logica complexă, afișăm "în construcție"
            gameContent.innerHTML = `<p class="under-construction">Tab-ul "${tabName}" este în construcție. Revino mai târziu!</p>`;
            console.log(`game-ui.js: Tab-ul '${tabName}' este în construcție.`);
            return;
        default:
            gameContent.innerHTML = `<p class="error-message">Tab necunoscut: ${tabName}</p>`;
            console.error(`game-ui.js: Tab necunoscut: ${tabName}`);
            return;
    }

    // Încărcăm conținutul HTML și apoi inițializăm logica tab-ului
    try {
        console.log(`game-ui.js: Se încearcă încărcarea conținutului pentru tab-ul '${tabName}' din components/${htmlFileName}...`);
        const response = await fetch(`components/${htmlFileName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM din components/${htmlFileName}.`);

        // Aici apelăm funcția de inițializare specifică dacă există
        if (initializer) {
            setTimeout(() => {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}...`);
                initializer();
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            }, 50); // Un mic delay pentru a asigura că elementele sunt în DOM înainte de inițializare
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}
