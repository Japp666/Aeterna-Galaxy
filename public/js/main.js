// public/js/main.js

import { getGameState, updateGameState, resetGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

// Elementele principale ale ecranului (acum corespund index.html)
// Acestea sunt direct sub #app, nu în alt div intermediar
const setupScreen = document.getElementById('welcome-screen'); // Re-denumit pentru claritate în log
const gameScreen = document.getElementById('game-screen');
const resetButton = document.getElementById('reset-game-button'); // Butonul de reset din header

// Informații din header (actualizate din game-state)
const clubNameHeader = document.getElementById('header-club-name');
const coachNameHeader = document.getElementById('header-coach-nickname');
const emblemHeader = document.getElementById('header-club-emblem');
const budgetHeader = document.getElementById('header-club-funds');
const newsBillboard = document.getElementById('news-billboard'); // Pentru Sezon/Ziua


/**
 * Inițializează jocul la pornirea aplicației.
 * Verifică starea jocului și decide ce ecran să afișeze.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");
    
    // Verifică existența containerelor principale la încărcarea DOM-ului
    if (!setupScreen || !gameScreen) { // Use setupScreen for the welcome/setup container
        console.error("main.js: Elementele '#welcome-screen' sau '#game-screen' nu au fost găsite la încărcarea DOM-ului. Aplicația nu poate porni corect.");
        document.body.innerHTML = `<p class="error-message">Eroare critică: Elemente principale ale aplicației lipsesc (welcome-screen, game-screen). Vă rugăm să verificați index.html.</p>`;
        return;
    }

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

    // Adaugă listener pentru butonul de resetare a jocului (din header, vizibil pe game-screen)
    // Acum este adăugat aici, dar s-ar putea să fie necesar să așteptăm ca header-ul să fie injectat dacă este cazul
    // Pentru simplitate, presupunem că #reset-game-button există în DOM din index.html de la început
    if (resetButton && !resetButton._hasClickListener) { // Evită adăugarea multiplă de listeneri
        resetButton.addEventListener('click', () => {
            if (confirm("Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!")) {
                resetGameState(); // Resetează starea jocului
                showSetupScreen(); // Afișează ecranul de configurare
                console.log("main.js: Jocul a fost resetat.");
            }
        });
        resetButton._hasClickListener = true; // Marchează că listener-ul a fost adăugat
        console.log("main.js: Listener adăugat la butonul Reset Joc.");
    }
});


/**
 * Afișează ecranul de configurare a jocului și inițializează logica sa.
 * ÎNCARCĂ CONȚINUTUL DINAMIC setup.html!
 */
async function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de configurare.");
    setupScreen.classList.remove('hidden'); // Asigură că welcomeScreen este vizibil pentru setup
    gameScreen.classList.add('hidden'); // Ascunde gameScreen

    try {
        const response = await fetch('components/setup.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        
        setupScreen.innerHTML = htmlContent; // Inject content into welcomeScreen
        console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");

        setTimeout(() => {
            console.log("main.js: showSetupScreen() - Se inițializează logica setup.js după un scurt delay...");
            initSetupScreen(onSetupComplete); // Pass only the callback, setup.js will find its elements
            console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat cu onSetupComplete ca callback.");
        }, 50);

    } catch (error) {
        console.error("main.js: Eroare la încărcarea conținutului setup.html:", error);
        setupScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
    }
}


/**
 * Afișează ecranul principal al jocului și inițializează UI-ul și informațiile.
 */
function showGameScreen() {
    console.log("main.js: showGameScreen() - Se afișează ecranul jocului.");
    setupScreen.classList.add('hidden'); // Ascunde setupScreen
    gameScreen.classList.remove('hidden'); // Afișează gameScreen

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
 * Callback apelat după ce setup-ul este complet și jocul pornește.
 */
function onSetupComplete() {
    console.log("main.js: onSetupComplete() - Funcția de callback onSetupComplete a fost apelată!");

    const currentGameState = getGameState();
    console.log("main.js: onSetupComplete() - Stare joc curentă (după setup - AR TREBUI SĂ FIE ACTUALIZATĂ CU DATELE DE SETUP):", currentGameState);

    if (!currentGameState.players || currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers // Actualizează doar proprietatea 'players'
        });
        console.log("main.js: onSetupComplete() - Jucători inițiali generați și stare actualizată cu ei.");
    } else {
        console.log("main.js: onSetupComplete() - Jucători existenți. Nu regenerez.");
    }

    showGameScreen();
    console.log("main.js: onSetupComplete() - Finalizarea callback-ului onSetupComplete. Se așteaptă afișarea ecranului de joc.");
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
 * Actualizează informațiile afișate în header (Nume Club, Antrenor, Buget, Emblemă, Sezon/Ziua).
 */
export function updateHeaderInfo() {
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const gameState = getGameState();

    if (emblemHeader && gameState.club && gameState.club.emblemUrl) emblemHeader.src = gameState.club.emblemUrl;
    if (coachNameHeader && gameState.coach && gameState.coach.nickname) coachNameHeader.textContent = `Antrenor: ${gameState.coach.nickname}`;
    if (clubNameHeader && gameState.club && gameState.club.name) clubNameHeader.textContent = `Club: ${gameState.club.name}`;
    if (budgetHeader && gameState.club && gameState.club.funds !== undefined) budgetHeader.textContent = `Buget: ${gameState.club.funds.toLocaleString('ro-RO')} Cr`;
    
    if (newsBillboard) {
        newsBillboard.textContent = `Sezon: ${gameState.currentSeason}, Ziua: ${gameState.currentMatchday}. Ultimele știri despre Liga Galactică!`;
    } else {
        console.warn("main.js: Elementul '#news-billboard' nu a fost găsit în header.");
    }

    console.log(`main.js: updateHeaderInfo() - Header actualizat. Emblemă: ${gameState.club ? gameState.club.emblemUrl : 'N/A'}, Nume Club: ${gameState.club ? gameState.club.name : 'N/A'}, Antrenor: ${gameState.coach ? gameState.coach.nickname : 'N/A'}, Buget: ${gameState.club ? gameState.club.funds : 'N/A'}`);
}
