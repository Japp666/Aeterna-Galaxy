// public/js/main.js

import { getGameState, updateGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');

/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");
    const gameState = getGameState();
    console.log("main.js: initializeGame() - Stare inițială a jocului. isGameStarted:", gameState.isGameStarted);

    if (gameState.isGameStarted) {
        console.log("main.js: initializeGame() - Stare joc încărcată din localStorage. isGameStarted este TRUE. Se afișează ecranul jocului.");
        showGameScreen();
    } else {
        console.log("main.js: initializeGame() - Nici o stare de joc salvată sau isGameStarted este FALSE. Se afișează ecranul de setup.");
        showSetupScreen();
    }
}

/**
 * Afișează ecranul de setup al jocului și inițializează logica specifică.
 * ACUM ÎNCARCĂ CONȚINUTUL DINAMIC!
 */
async function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de setup.");
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';

        try {
            // Încarcă conținutul HTML pentru ecranul de setup
            const response = await fetch('components/setup.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            setupScreen.innerHTML = htmlContent; // Injectează HTML-ul în div-ul setup-screen
            console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");

            // **MODIFICARE AICI**: Adăugăm un mic delay pentru a permite browserului să parseze DOM-ul
            setTimeout(() => {
                console.log("main.js: showSetupScreen() - Se inițializează logica setup.js după un scurt delay...");
                initSetupScreen(onSetupComplete);
                console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat cu onSetupComplete ca callback.");
            }, 50); // Un delay scurt, de obicei suficient

        } catch (error) {
            console.error("main.js: Eroare la încărcarea conținutului setup.html:", error);
            setupScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
        }
    } else {
        console.error("main.js: showSetupScreen() - Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

/**
 * Afișează ecranul principal al jocului.
 */
function showGameScreen() {
    console.log("main.js: showGameScreen() - Se afișează ecranul jocului.");
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        initGameUIComponents(); // Inițializează toate componentele UI ale jocului
        console.log("main.js: showGameScreen() - initGameUIComponents a fost apelat.");
    } else {
        console.error("main.js: showGameScreen() - Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

/**
 * Callback apelat după ce setup-ul este complet și jocul pornește.
 */
function onSetupComplete() {
    console.log("main.js: onSetupComplete() - Funcția de callback onSetupComplete a fost apelată!");

    const currentGameState = getGameState();
    console.log("main.js: onSetupComplete() - Stare joc curentă (după setup - AR TREBUI SĂ FIE ACTUALIZATĂ CU DATELE DE SETUP):", currentGameState);

    if (currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers,
            currentFormation: currentGameState.currentFormation || '4-4-2',
            currentMentality: currentGameState.currentMentality || 'normal'
        });
        console.log("main.js: onSetupComplete() - Jucători inițiali generați și stare actualizată cu ei.");
    } else {
        console.log("main.js: onSetupComplete() - Jucători existenți. Nu regenerez.");
    }

    showGameScreen();
    console.log("main.js: onSetupComplete() - Finalizarea callback-ului onSetupComplete. Se așteaptă afișarea ecranului de joc.");
}

/**
 * Funcție auxiliară pentru a actualiza informațiile din header-ul jocului.
 */
function updateHeaderInfo() {
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const currentGameState = getGameState();
    const headerClubEmblem = document.getElementById('header-club-emblem');
    const headerClubName = document.getElementById('header-club-name');
    const headerClubFunds = document.getElementById('header-club-funds');
    const headerCoachNickname = document.getElementById('header-coach-nickname');
    const headerSeason = document.getElementById('header-season');
    const headerDay = document.getElementById('header-day');

    if (headerClubEmblem) headerClubEmblem.src = currentGameState.club.emblemUrl;
    if (headerClubName) headerClubName.textContent = currentGameState.club.name;
    if (headerClubFunds) headerClubFunds.textContent = currentGameState.club.funds.toLocaleString('ro-RO');
    if (headerCoachNickname) headerCoachNickname.textContent = currentGameState.coach.nickname;
    if (headerSeason) headerSeason.textContent = currentGameState.currentSeason;
    if (headerDay) headerDay.textContent = currentGameState.currentDay;
    console.log("main.js: updateHeaderInfo() - Header actualizat. Emblemă:", currentGameState.club.emblemUrl, "Nume:", currentGameState.club.name);
}

/**
 * Inițializează toate componentele UI ale jocului după ce jocul a început sau a fost reîncărcat.
 */
function initGameUIComponents() {
    console.log("main.js: initGameUIComponents() - Apelând initUI() din game-ui.js.");
    initUI();
    updateHeaderInfo();
    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate. Ar trebui să vezi acum dashboard-ul.");
}

// Lansează procesul de inițializare când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', initializeGame);
