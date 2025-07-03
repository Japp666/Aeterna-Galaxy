// public/js/main.js - Punctul de intrare al aplicației

import { loadGameState, getGameState, resetGameState, updateGameState } from './game-state.js';
import { showGameScreen, updateHeaderInfo, initUI } from './game-ui.js'; // Import initUI
import { loadSetupScreen, initSetupScreen } from './setup.js'; // Asigură-te că setup.js exportă aceste funcții
import { generateInitialPlayers } from './player-generator.js'; // Pentru generarea jucătorilor

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
let resetButton = null; 

/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
async function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");

    const gameState = getGameState(); // Aceasta va încărca sau crea starea inițială

    // Adaugă listener pentru butonul Reset Joc
    resetButton = document.getElementById('reset-game-button');
    if (resetButton && !resetButton._hasClickListener) { // Evită adăugarea multiplă de listeneri
        resetButton.addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!')) {
                resetGameState(); // Apelăm funcția de reset din game-state.js
                // După reset, reîncărcăm pagina pentru a afișa ecranul de configurare
                window.location.reload(); 
            }
        });
        resetButton._hasClickListener = true; // Marchează că listener-ul a fost adăugat
        console.log("main.js: Listener adăugat la butonul Reset Joc.");
    } else if (!resetButton) {
        console.warn("main.js: Butonul 'reset-game-button' nu a fost găsit.");
    }

    if (!gameState.isGameStarted) {
        console.log("main.js: initializeGame() - Jocul nu este pornit. Se afișează ecranul de configurare.");
        try {
            await loadSetupScreen(); // Încarcă HTML-ul pentru ecranul de configurare
            initSetupScreen(onSetupComplete); // Inițializează logica ecranului de configurare
        } catch (error) {
            console.error("main.js: Eroare la încărcarea sau inițializarea ecranului de configurare:", error);
            // Afișează un mesaj de eroare pe ecranul de setup
            if (setupScreen) {
                setupScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
            }
        }
    } else {
        console.log("main.js: initializeGame() - Stare joc încărcată. isGameStarted este TRUE. Se afișează ecranul jocului.");
        showGameScreen(); // Afișează ecranul principal al jocului
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

    // Verificăm dacă jucătorii au fost deja generați de setup.js
    if (currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers,
            // currentFormation și currentMentality ar trebui să fie deja setate de setup.js
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

