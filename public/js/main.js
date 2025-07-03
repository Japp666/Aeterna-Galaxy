// public/js/main.js - Punctul de intrare al aplicației

import { getGameState, updateGameState, resetGameState } from './game-state.js'; // Corectat: Nu mai importă loadGameState
import { showGameScreen, updateHeaderInfo, initUI } from './game-ui.js'; 
import { loadSetupScreen, initSetupScreen } from './setup.js'; 
import { generateInitialPlayers } from './player-generator.js'; 

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
let resetButton = null; 

/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
async function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");

    // Folosim getGameState() care se ocupă intern de încărcarea din localStorage
    const gameState = getGameState(); 
    console.log("main.js: initializeGame() - Stare inițială a jocului. isGameStarted:", gameState.isGameStarted);

    // Adaugă listener pentru butonul Reset Joc
    resetButton = document.getElementById('reset-game-button');
    if (resetButton && !resetButton._hasClickListener) { 
        resetButton.addEventListener('click', () => {
            // Nu folosi alert/confirm direct în producție, folosește un modal custom UI
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
        try {
            await loadSetupScreen(); 
            initSetupScreen(onSetupComplete); 
        } catch (error) {
            console.error("main.js: Eroare la încărcarea sau inițializarea ecranului de configurare:", error);
            if (setupScreen) {
                setupScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
            }
        }
    } else {
        console.log("main.js: initializeGame() - Stare joc încărcată. isGameStarted este TRUE. Se afișează ecranul jocului.");
        showGameScreen(); 
    }
    console.log("main.js: initializeGame() - Inițializare joc finalizată.");
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

