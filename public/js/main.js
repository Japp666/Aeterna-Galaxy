// public/js/main.js

import { getGameState, updateGameState, resetGameState } from './game-state.js'; // Import resetGameState
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

const setupScreen = document.getElementById('welcome-screen'); // Re-denumit pentru claritate în log
const gameScreen = document.getElementById('game-screen');
let resetButton = null; 

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
 * ÎNCARCĂ CONȚINUTUL DINAMIC!
 */
async function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de setup.");
    if (setupScreen && gameScreen) {
        setupScreen.classList.remove('hidden'); 
        gameScreen.classList.add('hidden'); 

        try {
            const response = await fetch('components/setup.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            setupScreen.innerHTML = htmlContent;
            console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");

            setTimeout(() => {
                console.log("main.js: showSetupScreen() - Se inițializează logica setup.js după un scurt delay...");
                initSetupScreen(onSetupComplete);
                console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat cu onSetupComplete as callback.");
            }, 50);

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
        setupScreen.classList.add('hidden'); 
        gameScreen.classList.remove('hidden'); 
        initGameUIComponents(); 
        console.log("main.js: showGameScreen() - initGameUIComponents a fost apelat.");
    } else {
        console.error("main.js: showGameScreen() - Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

/**
 * Pornește jocul după configurare. Aceasta este funcția exportată și apelată din `setup.js`.
 */
export function startGame() {
    console.log("main.js: startGame() - Jocul a fost pornit. Se afișează ecranul jocului.");
    showGameScreen();
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
            currentMentality: currentGameState.currentMentality || 'balanced' 
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
 * Acum populează noul layout specificat de utilizator.
 */
export function updateHeaderInfo() { 
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const currentGameState = getGameState();

    const headerClubEmblem = document.getElementById('header-club-emblem');
    const headerCoachNickname = document.getElementById('header-coach-nickname');
    const headerClubName = document.getElementById('header-club-name');
    const headerClubFunds = document.getElementById('header-club-funds');
    const newsBillboard = document.getElementById('news-billboard'); 

    if (headerClubEmblem) headerClubEmblem.src = currentGameState.club.emblemUrl;
    if (headerCoachNickname) headerCoachNickname.textContent = `Antrenor: ${currentGameState.coach.nickname}`; 
    if (headerClubName) headerClubName.textContent = `Club: ${currentGameState.club.name}`; 
    if (headerClubFunds) headerClubFunds.textContent = `Buget: €${currentGameState.club.funds.toLocaleString('ro-RO')}`; // Ar trebui să fie "€"
    
    if (newsBillboard) {
        newsBillboard.textContent = `Sezon: ${currentGameState.currentSeason}, Ziua: ${currentGameState.currentMatchday}. Ultimele știri despre Liga Galactică!`;
    }
    
    console.log("main.js: updateHeaderInfo() - Header actualizat. Emblemă:", currentGameState.club.emblemUrl, "Nume Club:", currentGameState.club.name, "Antrenor:", currentGameState.coach.nickname, "Buget:", currentGameState.club.funds);
}

/**
 * Inițializează toate componentele UI ale jocului după ce jocul a început sau a fost reîncărcat.
 * Aici se adaugă și listener-ul pentru butonul de reset.
 */
function initGameUIComponents() {
    console.log("main.js: initGameUIComponents() - Apelând initUI() din game-ui.js.");
    initUI(); 
    updateHeaderInfo(); 

    resetButton = document.getElementById('reset-game-button');
    if (resetButton && !resetButton._hasClickListener) { 
        resetButton.addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!')) {
                resetGameState(); 
            }
        });
        resetButton._hasClickListener = true; 
        console.log("main.js: initGameUIComponents() - Listener adăugat la butonul Reset Joc.");
    } else if (!resetButton) {
        console.error("main.js: initGameUIComponents() - Butonul 'reset-game-button' nu a fost găsit.");
    }

    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate. Ar trebui să vezi acum dashboard-ul.");
}

document.addEventListener('DOMContentLoaded', initializeGame);
