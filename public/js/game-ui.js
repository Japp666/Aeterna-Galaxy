/* public/js/game-ui.js */

import { saveGameState, loadGameState } from './game-state.js';
import { initDashboardRenderer } from './dashboard-renderer.js';
import { renderRoster } from './roster-renderer.js';
import { initTacticsManager } from './tactics-manager.js';
// Import pentru setup.js - pentru inițializarea formularului de setup
import { initSetupForm } from './setup.js';

// Elementele UI principale
const gameContent = document.getElementById('game-content'); // Corectat ID-ul la 'game-content' 
const gameScreen = document.getElementById('game-screen');
const setupScreen = document.getElementById('setup-screen');
const headerClubEmblem = document.getElementById('header-club-emblem');
const headerCoachNickname = document.getElementById('header-coach-nickname');
const headerClubName = document.getElementById('header-club-name');
const headerClubFunds = document.getElementById('header-club-funds');
const newsBillboard = document.getElementById('news-billboard');
const resetGameButton = document.getElementById('reset-game-button');
const menuButtons = document.querySelectorAll('.main-menu .menu-button');

// Mapping de tab-uri către fișiere HTML și funcții de inițializare
const tabMap = {
    dashboard: {
        html: 'dashboard.html',
        initializer: initDashboardRenderer,
        rootElementId: 'dashboard-content'
    },
    team: {
        html: 'team.html',
        initializer: (rootElement) => {
            // Trece elementele specifice necesare de initTacticsManager
            const formationButtonsContainer = rootElement.querySelector('#formation-buttons');
            const mentalityButtonsContainer = rootElement.querySelector('#mentality-buttons');
            const footballPitchElement = rootElement.querySelector('#football-pitch');
            const availablePlayersListElement = rootElement.querySelector('#available-players-list');
            initTacticsManager(formationButtonsContainer, mentalityButtonsContainer, footballPitchElement, availablePlayersListElement);
        },
        rootElementId: 'team-content'
    },
    roster: {
        html: 'roster-tab.html',
        initializer: renderRoster, // renderRoster își va încărca propriul gameState
        rootElementId: 'roster-content'
    },
    // NU adăugați 'setup' aici, deoarece este gestionat separat și NU se încarcă în game-content
};


/**
 * Afișează un tab specific în zona de conținut principal a jocului.
 * @param {string} tabName Numele tab-ului de afișat (ex: 'dashboard', 'team').
 */
export async function showTab(tabName) {
    console.log(`game-ui.js: Se încearcă afișarea tab-ului: ${tabName}`);
    const tabInfo = tabMap[tabName];

    if (!tabInfo) {
        console.error(`game-ui.js: Tab-ul '${tabName}' nu există în mapare.`);
        return;
    }

    // Înlătură clasa 'active' de la toate butoanele de meniu
    menuButtons.forEach(button => button.classList.remove('active'));
    // Adaugă clasa 'active' la butonul corespunzător
    const activeButton = document.querySelector(`.main-menu .menu-button[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    try {
        const response = await fetch(`components/${tabInfo.html}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        // Asigură-te că gameContent este disponibil înainte de a-l modifica
        if (gameContent) {
            gameContent.innerHTML = htmlContent;
        } else {
            console.error("game-ui.js: Elementul 'game-content' nu a fost găsit. Nu se poate încărca tab-ul.");
            return;
        }

        console.log(`game-ui.js: Tab-ul \"${tabName}\" a fost încărcat în DOM din components/${tabInfo.html}.`);

        // Inițializează logica specifică tab-ului, dacă există
        if (tabInfo.initializer && tabInfo.rootElementId) {
            const tabRootElement = gameContent.querySelector(`#${tabInfo.rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${tabInfo.rootElementId})...`);
                tabInfo.initializer(tabRootElement); // Apelăm initializer, care va conține logica de găsire a elementelor intern
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            } else {
                console.error(`game-ui.js: Eroare: Elementul rădăcină #${tabInfo.rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit.</p>`;
            }
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${tabInfo.html}:`, error);
        if (gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
        }
    }
}

/**
 * Configurează UI-ul inițial și adaugă listeneri pentru butoanele de meniu.
 * Aceasta este apelată la încărcarea DOM-ului.
 */
export function setupInitialUI() {
    // Adaugă listeneri pentru butoanele de meniu
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            showTab(tabName);
        });
    });

    // Listener pentru butonul de reset
    if (resetGameButton) {
        resetGameButton.addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!')) {
                saveGameState(null); // Șterge starea salvată
                window.location.reload(); // Reîmprospătează pagina pentru a începe de la zero
            }
        });
    }
}

/**
 * Afișează ecranul principal al jocului și ascunde ecranul de setup.
 */
export function showGameScreen() {
    if (gameScreen) gameScreen.style.display = 'block';
    if (setupScreen) setupScreen.style.display = 'none';
}

/**
 * Afișează ecranul de setup și ascunde ecranul principal al jocului.
 */
export async function showSetupScreen() {
    if (setupScreen) setupScreen.style.display = 'block';
    if (gameScreen) gameScreen.style.display = 'none';

    // Încarcă direct setup.html în setupScreen
    try {
        const response = await fetch('components/setup.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        if (setupScreen) {
            setupScreen.innerHTML = htmlContent;
            console.log("game-ui.js: Conținutul setup.html a fost încărcat în #setup-screen.");
            // După încărcarea HTML-ului, inițializează formularul
            initSetupForm(); // Apelează initSetupForm după ce setup.html este încărcat în setupScreen
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la încărcarea ecranului de setup:`, error);
        if (setupScreen) {
            setupScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
        }
    }
}

/**
 * Actualizează elementele UI din header cu datele din starea jocului.
 * @param {object} gameState - Obiectul stării jocului.
 */
export function updateHeaderUI(gameState) {
    if (gameState && gameState.club && gameState.coach) {
        if (headerClubEmblem) headerClubEmblem.src = gameState.club.emblem;
        if (headerCoachNickname) headerCoachNickname.textContent = gameState.coach.nickname;
        if (headerClubName) headerClubName.textContent = gameState.club.name;
        if (headerClubFunds) headerClubFunds.textContent = `${gameState.club.funds.toLocaleString()} Cr`;
        if (newsBillboard) newsBillboard.textContent = "Ultimele știri aici!"; // Placeholder pentru știri
    }
}
