// public/js/main.js - Punctul de intrare al aplicației

import { getGameState, updateGameState, resetGameState } from './game-state.js';
import { showGameScreen, updateHeaderInfo, initUI } from './game-ui.js'; 
import { initSetupScreen } from './setup.js'; // Corectat: Importă doar initSetupScreen
import { generateInitialPlayers } from './player-generator.js'; 

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
let resetButton = null; 

/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
async function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");

    const gameState = getGameState(); 
    console.log("main.js: initializeGame() - Stare inițială a jocului. isGameStarted:", gameState.isGameStarted);

    // Adaugă listener pentru butonul Reset Joc
    resetButton = document.getElementById('reset-game-button');
    if (resetButton && !resetButton._hasClickListener) { 
        resetButton.addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!')) {
                resetGameState(); 
                window.location.reload(); 
            }
        });
        resetButton._hasClickListener = true; 
        console.log("main.js: Listener adăugat la butonul Reset Joc.");
    } else if (!resetButton) {
        console.warn("main.js: Butonul 'reset-game-button' nu a fost găsit.");
    }

    if (!gameState.isGameStarted) {
        console.log("main.js: initializeGame() - Jocul nu este pornit. Se afișează ecranul de configurare.");
        // Apelăm funcția locală showSetupScreen
        showSetupScreen(); 
    } else {
        console.log("main.js: initializeGame() - Stare joc încărcată. isGameStarted este TRUE. Se afișează ecranul jocului.");
        showGameScreen(); 
    }
    console.log("main.js: initializeGame() - Inițializare joc finalizată.");
}

/**
 * Afișează ecranul de setup al jocului și inițializează logica specifică.
 * ÎNCARCĂ CONȚINUTUL DINAMIC!
 */
async function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de setup.");
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';

        try {
            const response = await fetch('components/setup.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            setupScreen.innerHTML = htmlContent;
            console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");

            // Un delay scurt pentru a asigura că DOM-ul este gata
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
 * Callback apelat după ce setup-ul este complet și jocul pornește.
 */
function onSetupComplete() {
    console.log("main.js: onSetupComplete() - Funcția de callback onSetupComplete a fost apelată!");

    const currentGameState = getGameState();
    console.log("main.js: onSetupComplete() - Stare joc curentă (după setup):", currentGameState);

    if (currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers,
        });
        console.log("main.js: onSetupComplete() - Jucători inițiali generați și stare actualizată cu ei.");
    } else {
        console.log("main.js: onSetupComplete() - Jucători existenți. Nu regenerez.");
    }

    showGameScreen();
    console.log("main.js: onSetupComplete() - Finalizarea callback-ului onSetupComplete. Se așteaptă afișarea ecranului de joc.");
}

// Lansează procesul de inițializare când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', initializeGame);

