// public/js/game-ui.js

import { getGameState, updateGameState } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js';
import { initTeamTab } from './team.js';
import { initPlayerManagement } from './player-management.js'; // Importă doar initPlayerManagement
import { initNewsSystem } from './news.js'; // Pentru sistemul de știri
// Nu mai importăm TRAINING_TYPES sau renderPlayerDetails direct aici,
// deoarece player-management.js le gestionează intern pentru tab-ul 'roster'.
// Dacă vom avea un tab 'Antrenament' separat, vom crea un modul nou pentru el.


let gameContentDiv;
let gameHeaderDiv;
let menuButtons;
let currentActiveTab = null;

// Maparea tab-urilor la fișierele HTML, inițializatori și elemente rădăcină
const tabConfig = {
    'dashboard': { html: 'dashboard.html', initializer: renderDashboard, rootElementId: 'dashboard-content' },
    'team': { html: 'team.html', initializer: initTeamTab, rootElementId: 'team-content' },
    'roster': { html: 'roster-tab.html', initializer: initPlayerManagement, rootElementId: 'roster-content' }, // Actualizat: Folosește initPlayerManagement
    'players': { html: 'players.html', initializer: null, rootElementId: 'players-content' }, // "Antrenament" - va necesita un modul dedicat
    'finances': { html: 'finance.html', initializer: null, rootElementId: 'finance-content' },
    'fixtures': { html: 'matches.html', initializer: null, rootElementId: 'matches-content' },
    'standings': { html: 'standings.html', initializer: null, rootElementId: 'standings-content' },
    'scouting': { html: 'transfers.html', initializer: null, rootElementId: 'transfers-content' },
    'settings': { html: 'settings.html', initializer: null, rootElementId: 'settings-content' }
};

/**
 * Inițializează interfața utilizatorului jocului.
 */
export function initUI() {
    console.log("game-ui.js: initUI() - Începerea inițializării UI-ului jocului.");
    gameContentDiv = document.getElementById('game-content');
    gameHeaderDiv = document.getElementById('game-header');
    menuButtons = document.querySelectorAll('.menu-button');

    if (!gameContentDiv || !gameHeaderDiv || menuButtons.length === 0) {
        console.error("game-ui.js: Elemente UI esențiale lipsesc. Asigură-te că game-content, game-header și butoanele de meniu există în DOM.");
        return;
    }

    addMenuListeners();
    updateHeaderInfo(); // Actualizează informațiile din header la inițializare
    displayTab('dashboard'); // Afișează dashboard-ul la pornire
    console.log("game-ui.js: UI inițializat. Se afișează dashboard-ul.");
}

/**
 * Adaugă listeneri de evenimente butoanelor din meniu.
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
 * Afișează un tab specific și încarcă conținutul HTML corespunzător.
 * @param {string} tabName - Numele tab-ului de afișat (ex: 'dashboard', 'team').
 */
export async function displayTab(tabName) {
    console.log(`game-ui.js: displayTab() - Se încearcă afișarea tab-ului: ${tabName}. Tab activ curent: ${currentActiveTab}`);

    const config = tabConfig[tabName];
    if (!config) {
        console.error(`game-ui.js: Configurație lipsă pentru tab-ul: ${tabName}`);
        gameContentDiv.innerHTML = `<p class="error-message">Eroare: Tab-ul '${tabName}' nu este configurat.</p>`;
        return;
    }

    // Dezactivează tab-ul curent vizual
    if (currentActiveTab) {
        const prevButton = document.querySelector(`.menu-button[data-tab="${currentActiveTab}"]`);
        if (prevButton) {
            prevButton.classList.remove('active');
        }
    }

    // Activează noul tab vizual
    const newButton = document.querySelector(`.menu-button[data-tab="${tabName}"]`);
    if (newButton) {
        newButton.classList.add('active');
    }
    currentActiveTab = tabName;

    try {
        console.log(`game-ui.js: Se încearcă încărcarea conținutului pentru tab-ul '${tabName}' din components/${config.html}...`);
        const response = await fetch(`components/${config.html}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContentDiv.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM din components/${config.html}.`);

        if (config.initializer && config.rootElementId) {
            const tabRootElement = gameContentDiv.querySelector(`#${config.rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${config.rootElementId}) și starea jocului...`);
                
                // Obține cea mai recentă stare a jocului chiar înainte de a inițializa tab-ul
                const currentGameState = getGameState(); 
                // Inițializatorii pot primi rootElement și gameState
                config.initializer(tabRootElement, currentGameState); 
                
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            } else {
                console.error(`game-ui.js: Eroare: Elementul rădăcină #${config.rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContentDiv.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit.</p>`;
            }
        } else if (config.initializer && !config.rootElementId) {
             // Cazul în care initializer-ul nu are nevoie de un rootElementId specific (ex: poate manipula direct DOM-ul global sau are propria logică de selecție)
            console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName} fără un element rădăcină specific...`);
            config.initializer(getGameState()); // Trecem doar gameState
            console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
        }
        // Dacă nu există initializer, înseamnă că tab-ul este doar HTML static.

    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${config.html}:`, error);
        gameContentDiv.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}". Vă rugăm să reîncărcați jocul.</p>`;
    }
}

/**
 * Actualizează informațiile din header (nume club, fonduri, sezon, zi).
 */
export function updateHeaderInfo() {
    const gameState = getGameState();
    if (gameState && gameState.club && gameState.coach && gameState.currentSeason !== undefined && gameState.currentDay !== undefined) {
        const clubEmblemElement = document.getElementById('header-club-emblem');
        const coachNicknameElement = document.getElementById('header-coach-nickname');
        const clubNameElement = document.getElementById('header-club-name');
        const clubFundsElement = document.getElementById('header-club-funds');
        // const seasonDayElement = document.getElementById('header-season-day'); // Nu există în index.html

        if (clubEmblemElement) clubEmblemElement.src = gameState.club.emblemUrl || '';
        if (coachNicknameElement) coachNicknameElement.textContent = gameState.coach.nickname || 'N/A';
        if (clubNameElement) clubNameElement.textContent = gameState.club.name || 'N/A';
        if (clubFundsElement) clubFundsElement.textContent = `${(gameState.club.funds || 0).toLocaleString('ro-RO')} €`;
        // if (seasonDayElement) seasonDayElement.textContent = `Sezon: ${gameState.currentSeason} | Ziua: ${gameState.currentDay}`;
    }
    console.log("game-ui.js: Informații header actualizate.");
}

/**
 * Afișează ecranul principal al jocului și ascunde ecranul de configurare.
 */
export function showGameScreen() {
    const setupScreen = document.getElementById('setup-screen'); // Asigură-te că este definit
    const gameScreen = document.getElementById('game-screen'); // Asigură-te că este definit

    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex'; // Folosim flex pentru layout
        initUI(); // Inițializează UI-ul jocului când se afișează ecranul de joc
        console.log("game-ui.js: Ecranul jocului a fost afișat.");
    } else {
        console.error("game-ui.js: Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
    updateHeaderInfo(); // Asigură-te că header-ul este actualizat la afișarea ecranului de joc
}

/**
 * Ascunde ecranul principal al jocului și afișează ecranul de configurare.
 */
export function showSetupScreen() {
    const setupScreen = document.getElementById('setup-screen'); // Asigură-te că este definit
    const gameScreen = document.getElementById('game-screen'); // Asigură-te că este definit

    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        console.log("game-ui.js: Ecranul de configurare a fost afișat.");
    } else {
        console.error("game-ui.js: Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

// Funcții pentru modalul de confirmare (dacă este necesar)
// Acestea ar trebui să fie implementate ca un modal personalizat, nu alert/confirm
export function showConfirmationModal(message, onConfirm, onCancel) {
    // Implementare placeholder pentru un modal de confirmare personalizat
    // NU folosi window.confirm() sau alert()
    console.warn("showConfirmationModal: Funcție placeholder. Implementează un modal UI real.");
    if (confirm(message)) { // Folosit doar pentru testare rapidă, va fi înlocuit
        onConfirm();
    } else {
        onCancel();
    }
}
