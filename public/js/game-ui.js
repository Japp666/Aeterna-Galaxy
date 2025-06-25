// public/js/game-ui.js

import { loadDashboardTabContent, initDashboardTab } from './dashboard-renderer.js';
import { loadTeamTabContent, initTeamTab } from './team.js';
import { loadRosterTabContent, initRosterTab } from './roster-renderer.js';
// Importul pentru setup.js a fost scos de aici, pentru că logica de setup e în main.js acum.

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');

let activeTab = null;

// Exportă funcția initUI
export function initUI() { // Fără parametri aici, onSetupCompleteCallback este gestionat de main.js
    console.log("game-ui.js: initUI() - Inițializarea UI-ului jocului.");

    addMenuListeners();
    displayTab('dashboard'); // Afișează tab-ul dashboard la inițializare
    console.log("game-ui.js: initUI() - UI inițializat. Dashboard-ul ar trebui să fie activ.");
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

    let contentLoader;
    let initializer;

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
             contentLoader = loadRosterTabContent;
             initializer = initRosterTab;
             break;
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

    try {
        console.log(`game-ui.js: Se încearcă încărcarea conținutului pentru tab-ul '${tabName}'...`);
        const htmlContent = await contentLoader();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM.`);

        setTimeout(() => {
            console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}...`);
            initializer();
            console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
        }, 50);
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}':`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}
