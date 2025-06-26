// public/js/game-ui.js

import { loadDashboardTabContent, initDashboardTab } from './dashboard-renderer.js';
import { loadTeamTabContent, initTeamTab } from './team.js';
import { loadRosterTabContent, initRosterTab } from './roster-renderer.js';

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');

let activeTab = null;

export function initUI() { 
    console.log("game-ui.js: initUI() - Începerea inițializării UI-ului jocului.");
    addMenuListeners();
    // La inițializare, dacă jocul e pornit, afișăm dashboard-ul
    displayTab('dashboard');
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

    let initializer = null;   // Funcția care inițializează logica JS a tab-ului
    let htmlFileName = '';    // Numele fișierului HTML din components/
    let rootElementId = '';   // ID-ul elementului rădăcină al tab-ului încărcat

    switch (tabName) {
        case 'dashboard':
            htmlFileName = 'dashboard.html';
            initializer = initDashboardTab;
            rootElementId = 'dashboard-content'; // ID-ul containerului din dashboard.html
            break;
        case 'team':
            htmlFileName = 'team.html';
            initializer = initTeamTab;
            rootElementId = 'team-content'; // ID-ul containerului din team.html
            break;
        case 'roster': 
            htmlFileName = 'roster-tab.html';
            initializer = initRosterTab;
            rootElementId = 'roster-content'; // ID-ul containerului din roster-tab.html
            break;
        case 'training':
            htmlFileName = 'training.html';
            // initializer = initTrainingTab; 
            rootElementId = 'training-content'; // Presupunem un ID, dacă va exista
            break;
        case 'finances':
            htmlFileName = 'finance.html';
            // initializer = initFinancesTab;
            rootElementId = 'finance-content'; // Presupunem un ID
            break;
        case 'fixtures':
            htmlFileName = 'matches.html';
            // initializer = initFixturesTab;
            rootElementId = 'matches-content'; // Presupunem un ID
            break;
        case 'standings':
            htmlFileName = 'standings.html';
            // initializer = initStandingsTab;
            rootElementId = 'standings-content'; // Presupunem un ID
            break;
        case 'scouting':
            htmlFileName = 'transfers.html';
            // initializer = initScoutingTab;
            rootElementId = 'transfers-content'; // Presupunem un ID
            break;
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
        console.log(`game-ui.js: Se încearcă încărcarea conținutului pentru tab-ul '${tabName}' din components/${htmlFileName}...`);
        const response = await fetch(`components/${htmlFileName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM din components/${htmlFileName}.`);

        if (initializer && rootElementId) {
            // După ce HTML-ul este injectat, găsim elementul rădăcină specific
            const tabRootElement = gameContent.querySelector(`#${rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${rootElementId})...`);
                // Adăugăm un mic timeout pentru a permite browserului să parseze noul DOM
                // Increased timeout duration for more complex modules like 'team'
                const timeoutDuration = (tabName === 'team') ? 150 : 50; // Use 150ms for 'team', 50ms for others
                setTimeout(() => {
                    initializer(tabRootElement); 
                    console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
                }, timeoutDuration); 

            } else {
                console.error(`game-ui.js: Eroare: Elementul rădăcină #${rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit.</p>`;
            }
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}
