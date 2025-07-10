// game-ui.js
import { getGameState, updateGameState } from './game-state.js';
import { initializeSetupScreen } from './setup.js';
import { initializeDashboard } from './dashboard-renderer.js';
import { initializeRoster } from './roster-renderer.js';
import { initializeTeamTactics } from './tactics-manager.js';

const gameScreen = document.getElementById('game-screen');
const setupScreen = document.getElementById('setup-screen');
const gameContent = document.getElementById('game-content');
const gameMenu = document.getElementById('game-menu');

// Map of tab names to their HTML files and initializer functions
const tabs = {
    'Dashboard': { html: 'dashboard.html', initializer: initializeDashboard, rootElementId: 'dashboard-screen' },
    'Echipă': { html: 'team.html', initializer: initializeTeamTactics, rootElementId: 'team-tactics-screen' },
    'Lot Jucători': { html: 'roster.html', initializer: initializeRoster, rootElementId: 'player-roster-screen' },
    // Adaugă aici celelalte tab-uri când sunt create
};

// CORECTIE NOUA: Functie dedicata pentru afisarea ecranului de joc
export function displayGameScreen() {
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    updateHeader(); // Actualizează header-ul
    loadTab('Dashboard'); // Încarcă tab-ul implicit
}

// Function to display specific tab content
export async function loadTab(tabName) {
    const gameState = getGameState();
    const htmlFileName = tabs[tabName].html;
    const initializer = tabs[tabName].initializer;
    const rootElementId = tabs[tabName].rootElementId;

    try {
        console.log(`game-ui.js: Se încearcă încărcarea tab-ului '${tabName}' din components/${htmlFileName}...`);
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

// Function to update the header with game state info
export function updateHeader() {
    const gameState = getGameState();
    const clubNameElement = document.getElementById('header-club-name');
    const coachNicknameElement = document.getElementById('header-coach-nickname');
    const clubFundsElement = document.getElementById('header-club-funds');
    const newsBillboardElement = document.getElementById('news-billboard-content');
    const clubEmblemImage = document.getElementById('header-club-emblem'); // NOU

    if (clubNameElement) clubNameElement.textContent = gameState.clubName || 'Nume Club';
    if (coachNicknameElement) coachNicknameElement.textContent = gameState.coachNickname || 'Nume Antrenor';
    if (clubFundsElement) clubFundsElement.textContent = `${gameState.clubFunds.toLocaleString('ro-RO')} €` || '0 €';
    
    // NOU: Actualizează emblema clubului în header
    if (clubEmblemImage && gameState.clubEmblem) {
        // Asumăm că emblemele sunt în aceeași cale publică ca și cele din setup.js
        clubEmblemImage.src = `../public/img/emblems/${gameState.clubEmblem}`;
    } else if (clubEmblemImage) {
        clubEmblemImage.src = ''; // Clear if no emblem
    }

    // Exemplu de știre (va fi populat dinamic)
    if (newsBillboardElement) newsBillboardElement.textContent = `Ziua ${gameState.currentDay}, Sezonul ${gameState.currentSeason}. Ultima știre aici!`;
}


// Initialization function for game UI
export function initializeGameUI() {
    console.log("game-ui.js: Inițializare UI joc...");
    const gameState = getGameState();
    if (gameState && gameState.clubName && gameState.coachNickname) {
        // CORECTIE: Apelam displayGameScreen pentru a afisa ecranul de joc
        console.log("game-ui.js: Stare de joc existentă. Se afișează ecranul de joc.");
        displayGameScreen();
    } else {
        console.log("game-ui.js: Nu există stare de joc salvată. Se afișează ecranul de setup.");
        setupScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        initializeSetupScreen(setupScreen);
    }
}

// Add event listeners for menu items
if (gameMenu) {
    gameMenu.addEventListener('click', (event) => {
        const menuItem = event.target.closest('.menu-item');
        if (menuItem) {
            const tabName = menuItem.dataset.tab;
            if (tabName) {
                loadTab(tabName);
            }
        }
    });
}
