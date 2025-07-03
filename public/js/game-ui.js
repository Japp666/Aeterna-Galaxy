// public/js/game-ui.js

import { getGameState, updateGameState } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js'; // Import corectat
import { renderPlayerList, renderPlayerDetails, TRAINING_TYPES, setPlayerTrainingFocus } from './player-management.js'; // Import TRAINING_TYPES și setPlayerTrainingFocus
import { initNewsSystem } from './news.js'; // Import pentru sistemul de știri
import { initTeamTab } from './team.js'; // Import pentru tab-ul Echipă
import { initRosterTab } from './roster-renderer.js'; // Import pentru tab-ul Lot Jucători

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');

let activeTab = null;
let selectedPlayerId = null; // Variabilă pentru a ține evidența jucătorului selectat în tab-ul 'players'

export function initUI() { 
    console.log("game-ui.js: initUI() - Începerea inițializării UI-ului jocului.");
    addMenuListeners();
    updateHeaderInfo(); // Actualizează informațiile din header la inițializarea UI-ului
    
    // Inițializează sistemul de știri
    const newsBillboard = document.getElementById('news-billboard');
    if (newsBillboard) {
        initNewsSystem(newsBillboard);
    } else {
        console.warn("game-ui.js: Elementul 'news-billboard' nu a fost găsit. Sistemul de știri nu va fi inițializat.");
    }

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
        // Totuși, dacă e tab-ul de jucători, poate vrem să re-randăm pentru a reflecta schimbări
        if (tabName === 'players') {
            initializePlayersTab();
        }
        return;
    }

    activeTab = tabName;

    let initializer = null;   // Funcția care inițializează logica JS a tab-ului
    let htmlFileName = '';    // Numele fișierului HTML din components/
    let rootElementId = '';   // ID-ul elementului rădăcină al tab-ului încărcat

    switch (tabName) {
        case 'dashboard':
            htmlFileName = 'dashboard.html';
            initializer = renderDashboard; // Acum apelăm direct renderDashboard
            rootElementId = 'dashboard-content'; 
            break;
        case 'team':
            htmlFileName = 'team.html';
            initializer = initTeamTab;
            rootElementId = 'team-content'; 
            break;
        case 'roster': 
            htmlFileName = 'roster-tab.html';
            initializer = initRosterTab;
            rootElementId = 'roster-content'; 
            break;
        case 'players': // NOU: Tab-ul pentru managementul jucătorilor/antrenament
            htmlFileName = 'players.html'; // Noul fișier HTML
            initializer = initializePlayersTab; // Funcția de inițializare locală
            rootElementId = 'players-content'; // ID-ul containerului din players.html
            break;
        case 'finances':
            htmlFileName = 'finance.html';
            // initializer = initFinancesTab; // TODO: Implement this
            rootElementId = 'finance-content'; 
            break;
        case 'fixtures':
            htmlFileName = 'matches.html';
            // initializer = initFixturesTab; // TODO: Implement this
            rootElementId = 'matches-content'; 
            break;
        case 'standings':
            htmlFileName = 'standings.html';
            // initializer = initStandingsTab; // TODO: Implement this
            rootElementId = 'standings-content'; 
            break;
        case 'scouting':
            htmlFileName = 'transfers.html';
            // initializer = initScoutingTab; // TODO: Implement this
            rootElementId = 'transfers-content'; 
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
            const tabRootElement = gameContent.querySelector(`#${rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${rootElementId})...`);
                // Apelăm direct initializer, care va conține logica de găsire a elementelor intern
                initializer(tabRootElement); 
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
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

/**
 * Inițializează tab-ul de jucători, randând lista și detaliile.
 * @param {HTMLElement} playersContentElement - Elementul rădăcină al tab-ului "Jucători" (#players-content).
 */
function initializePlayersTab(playersContentElement) {
    console.log("game-ui.js: initializePlayersTab() - Se inițializează tab-ul de jucători.");
    const gameState = getGameState();
    const playerListContainer = playersContentElement.querySelector('#player-list');
    const playerDetailsContainer = playersContentElement.querySelector('#player-details');

    if (playerListContainer && playerDetailsContainer) {
        // Funcție callback pentru selectarea unui jucător
        const handlePlayerSelect = (playerId) => {
            selectedPlayerId = playerId;
            const player = gameState.players.find(p => p.id === playerId);
            renderPlayerDetails(playerDetailsContainer, player, TRAINING_TYPES); // Pasăm TRAINING_TYPES
            // Re-randăm lista pentru a actualiza clasa 'selected'
            renderPlayerList(playerListContainer, gameState.players, selectedPlayerId, handlePlayerSelect);
        };

        // Randăm lista inițială de jucători
        renderPlayerList(playerListContainer, gameState.players, selectedPlayerId, handlePlayerSelect);

        // Randăm detaliile jucătorului selectat (dacă există unul deja selectat)
        if (selectedPlayerId) {
            const player = gameState.players.find(p => p.id === selectedPlayerId);
            renderPlayerDetails(playerDetailsContainer, player, TRAINING_TYPES); // Pasăm TRAINING_TYPES
        } else {
            // Asigură-te că mesajul inițial este afișat dacă nu e niciun jucător selectat
            playerDetailsContainer.innerHTML = '<p class="select-player-message">Selectează un jucător din listă pentru a vedea detaliile și opțiunile de antrenament.</p>';
        }

        console.log("game-ui.js: Tab-ul de jucători a fost inițializat.");
    } else {
        console.error("game-ui.js: Containerele pentru lista sau detaliile jucătorilor nu au fost găsite.");
    }
}

/**
 * Funcție auxiliară pentru a actualiza informațiile din header-ul jocului.
 */
export function updateHeaderInfo() {
    const currentGameState = getGameState();
 
    const headerClubEmblem = document.getElementById('header-club-emblem');
    const headerCoachNickname = document.getElementById('header-coach-nickname');
    const headerClubName = document.getElementById('header-club-name');
    const headerClubFunds = document.getElementById('header-club-funds');
    
    if (headerClubEmblem) headerClubEmblem.src = currentGameState.club.emblemUrl || '';
    if (headerCoachNickname) headerCoachNickname.textContent = `Antrenor: ${currentGameState.coach.nickname || 'N/A'}`;
    if (headerClubName) headerClubName.textContent = `Club: ${currentGameState.club.name || 'N/A'}`;
    if (headerClubFunds) headerClubFunds.textContent = `Buget: ${currentGameState.club.funds.toLocaleString('ro-RO')} €`;
    
    console.log("game-ui.js: Informații header actualizate.");
}

/**
 * Afișează ecranul principal al jocului.
 */
export function showGameScreen() {
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');

    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex'; // Sau 'block', depinde de layout
        initUI(); // Inițializează UI-ul tab-urilor și navigația
        console.log("game-ui.js: Ecranul jocului a fost afișat.");
    } else {
        console.error("game-ui.js: Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}
