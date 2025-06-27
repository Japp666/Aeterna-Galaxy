// public/js/main.js

import { getGameState, saveGameState, resetGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI, displayTab } from './game-ui.js';

// Elementele principale ale ecranului
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const loadingScreen = document.getElementById('loading-screen');
const resetButton = document.getElementById('reset-game-button');

// Informații din header (actualizate din game-state)
const clubNameHeader = document.getElementById('header-club-name');
const coachNameHeader = document.getElementById('header-coach-name');
const emblemHeader = document.getElementById('header-emblem');
const budgetHeader = document.getElementById('header-budget');
const seasonInfo = document.getElementById('season-info');

/**
 * Inițializează jocul la pornirea aplicației.
 * Verifică starea jocului și decide ce ecran să afișeze.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");
    const gameState = getGameState(); // Încarcă starea jocului

    console.log("main.js: initializeGame() - Stare inițială a jocului. isGameStarted:", gameState.isGameStarted);

    if (gameState.isGameStarted) {
        // Dacă jocul este deja pornit, afișează ecranul jocului
        console.log("main.js: initializeGame() - Stare joc încărcată din localStorage. isGameStarted este TRUE. Se afișează ecranul jocului.");
        showGameScreen();
    } else {
        // Dacă jocul nu a fost pornit niciodată, afișează ecranul de configurare
        console.log("main.js: initializeGame() - Jocul nu este pornit. Se afișează ecranul de configurare.");
        showSetupScreen();
    }

    // Adaugă listener pentru butonul de resetare a jocului
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            const confirmReset = confirm("Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!");
            if (confirmReset) {
                resetGameState(); // Resetează starea jocului
                showSetupScreen(); // Afișează ecranul de configurare
                console.log("main.js: Jocul a fost resetat.");
            }
        });
        console.log("main.js: initGameUIComponents() - Listener adăugat la butonul Reset Joc.");
    }
});


/**
 * Afișează ecranul de configurare a jocului și inițializează logica sa.
 */
function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de configurare.");
    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    if (gameScreen) gameScreen.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.add('hidden');
    initSetupScreen(); // Inițializează logica pentru ecranul de configurare
}

/**
 * Afișează ecranul principal al jocului și inițializează UI-ul și informațiile.
 */
function showGameScreen() {
    console.log("main.js: showGameScreen() - Se afișează ecranul jocului.");
    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (gameScreen) gameScreen.classList.remove('hidden');
    if (loadingScreen) loadingScreen.classList.add('hidden');

    initGameUIComponents(); // Inițializează componentele UI ale jocului
    console.log("main.js: showGameScreen() - initGameUIComponents a fost apelat.");
}

/**
 * Pornește jocul după configurare. Aceasta este funcția exportată și apelată din `setup.js`.
 */
export function startGame() {
    console.log("main.js: startGame() - Jocul a fost pornit. Se afișează ecranul jocului.");
    showGameScreen();
}


/**
 * Inițializează componentele UI ale jocului principal (meniuri, tab-uri, etc.).
 */
function initGameUIComponents() {
    console.log("main.js: initGameUIComponents() - Apelând initUI() din game-ui.js.");
    initUI(); // Inițializează meniurile și tab-urile
    updateHeaderInfo(); // Actualizează informațiile din header
    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate. Ar trebui să vezi acum dashboard-ul.");
}

/**
 * Actualizează informațiile afișate în header (Nume Club, Antrenor, Buget, Emblemă).
 */
export function updateHeaderInfo() {
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const gameState = getGameState(); // Încarcă starea jocului din nou

    if (clubNameHeader) clubNameHeader.textContent = gameState.clubName;
    if (coachNameHeader) coachNameHeader.textContent = gameState.coachName;
    if (emblemHeader) emblemHeader.src = gameState.teamEmblem;
    if (budgetHeader) budgetHeader.textContent = `€${gameState.budget.toLocaleString('en-US')}`; // Formatare buget
    if (seasonInfo) seasonInfo.textContent = `Sezon ${gameState.currentSeason}, Ziua ${gameState.currentMatchday}`;

    console.log(`main.js: updateHeaderInfo() - Header actualizat. Emblemă: ${gameState.teamEmblem} Nume Club: ${gameState.clubName} Antrenor: ${gameState.coachName} Buget: ${gameState.budget}`);
}
