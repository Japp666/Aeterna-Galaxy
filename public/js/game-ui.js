// public/js/game-ui.js

import { initDashboardTab } from './dashboard-renderer.js';
import { initTeamTab } from './team.js';
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
        
        // NOU: Folosim un element <template> pentru a parse HTML-ul
        const tempContainer = document.createElement('template');
        tempContainer.innerHTML = htmlContent.trim(); // Trim pentru a evita spații inutile

        // Verificăm dacă elementul rădăcină al tab-ului există în template
        const parsedTabRootElement = tempContainer.content.querySelector(`#${rootElementId}`);

        if (!parsedTabRootElement) {
            console.error(`game-ui.js: Eroare: Elementul rădăcină #${rootElementId} nu a fost găsit în HTML-ul parsert din ${htmlFileName}.`);
            gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit în fișierul HTML.</p>`;
            return;
        }

        // Curățăm gameContent și adăugăm conținutul parsert din template
        gameContent.innerHTML = ''; // Curățăm complet
        gameContent.appendChild(parsedTabRootElement); // Adăugăm elementul parsert
        
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat și injectat în DOM din components/${htmlFileName}.`);

        if (initializer) { // Nu mai avem nevoie de rootElementId aici, l-am găsit deja
            // Folosim requestAnimationFrame pentru a amâna inițializarea logicii JS
            // Aceasta oferă browserului un moment pentru a randa elementele injectate
            window.requestAnimationFrame(() => {
                console.log("game-ui.js: Inițializare logică tab via requestAnimationFrame.");
                // Treceți elementul live (din DOM-ul curent, nu din template)
                const liveTabRootElement = document.getElementById(rootElementId);
                if (liveTabRootElement) {
                    initializer(liveTabRootElement); 
                } else {
                    console.error(`game-ui.js: Eroare critică: Elementul rădăcină #${rootElementId} a dispărut după injectare.`);
                    gameContent.innerHTML = `<p class="error-message">Eroare critică la inițializare: Elementul tab-ului nu a putut fi găsit în DOM-ul live.</p>`;
                }
            });
            
            console.log(`game-ui.js: Cerere de inițializare logică pentru tab-ul ${tabName} trimisă.`);
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}
