// public/js/main.js

import { getGameState, updateGameState, resetGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const loadingScreen = document.getElementById('loading-screen'); // Adăugat pentru consistență
const resetButton = document.getElementById('reset-game-button');

// Informații din header (actualizate din game-state)
const clubNameHeader = document.getElementById('header-club-name');
const coachNameHeader = document.getElementById('header-coach-nickname'); // Renamed to match HTML
const emblemHeader = document.getElementById('header-club-emblem'); // Renamed to match HTML
const budgetHeader = document.getElementById('header-club-funds'); // Renamed to match HTML
const seasonInfo = document.getElementById('season-info'); // This element doesn't exist in index.html, remove or add it

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
            // Nu folosi alert/confirm direct în producție, folosește un modal custom UI
            if (confirm("Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!")) {
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
 * ÎNCARCĂ CONȚINUTUL DINAMIC!
 */
async function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de configurare.");
    if (welcomeScreen) welcomeScreen.classList.remove('hidden'); // Ensure welcomeScreen is visible for setup
    if (gameScreen) gameScreen.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.add('hidden'); // Ensure loadingScreen is hidden

    // Load setup.html content dynamically
    try {
        const response = await fetch('components/setup.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        if (welcomeScreen) { // Inject content into welcomeScreen (which acts as setup container)
            welcomeScreen.innerHTML = htmlContent;
            console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");

            // Inițializează logica setup.js după ce HTML-ul este injectat
            // Trecem elementul #welcome-screen care acum conține #setup-container
            // și callback-ul onSetupComplete.
            setTimeout(() => {
                console.log("main.js: showSetupScreen() - Se inițializează logica setup.js după un scurt delay...");
                initSetupScreen(welcomeScreen, onSetupComplete); // Pass welcomeScreen as the container
                console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat cu welcomeScreen ca element container și onSetupComplete ca callback.");
            }, 50); // Un delay scurt pentru a permite browserului să randeze DOM-ul
        } else {
            console.error("main.js: showSetupScreen() - Elementul '#welcome-screen' nu a fost găsit.");
        }

    } catch (error) {
        console.error("main.js: Eroare la încărcarea conținutului setup.html:", error);
        if (welcomeScreen) welcomeScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
    }
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
 * Callback apelat după ce setup-ul este complet și jocul pornește.
 */
function onSetupComplete() {
    console.log("main.js: onSetupComplete() - Funcția de callback onSetupComplete a fost apelată!");

    const currentGameState = getGameState();
    console.log("main.js: onSetupComplete() - Stare joc curentă (după setup - AR TREBUI SĂ FIE ACTUALIZATĂ CU DATELE DE SETUP):", currentGameState);

    // Generează jucători inițiali doar dacă nu există deja
    if (!currentGameState.players || currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers // Actualizează doar proprietatea 'players'
            // currentFormation și currentMentality ar trebui deja să aibă valori implicite sau să fie setate
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

    // Acum că game-screen este afișat și butonul reset ar trebui să existe
    if (resetButton && !resetButton._hasClickListener) { // Evită adăugarea multiplă de listeneri
        resetButton.addEventListener('click', () => {
            // Nu folosi alert/confirm direct în producție, folosește un modal custom UI
            if (confirm('Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!')) {
                resetGameState(); // Apelăm funcția de reset din game-state.js
                // După reset, afișăm din nou ecranul de configurare
                showSetupScreen();
            }
        });
        resetButton._hasClickListener = true; // Marchează că listener-ul a fost adăugat
        console.log("main.js: initGameUIComponents() - Listener adăugat la butonul Reset Joc.");
    } else if (!resetButton) {
        console.error("main.js: initGameUIComponents() - Butonul 'reset-game-button' nu a fost găsit.");
    }

    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate. Ar trebui să vezi acum dashboard-ul.");
}

/**
 * Actualizează informațiile afișate în header (Nume Club, Antrenor, Buget, Emblemă, Sezon/Ziua).
 */
export function updateHeaderInfo() {
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const gameState = getGameState();

    // Verificăm existența elementelor înainte de a le accesa
    if (emblemHeader) emblemHeader.src = gameState.club.emblemUrl;
    if (coachNameHeader) coachNameHeader.textContent = `Antrenor: ${gameState.coach.nickname}`;
    if (clubNameHeader) clubNameHeader.textContent = `Club: ${gameState.club.name}`;
    if (budgetHeader) budgetHeader.textContent = `Buget: ${gameState.club.funds.toLocaleString('ro-RO')} Cr`;
    
    const newsBillboard = document.getElementById('news-billboard'); // Elementul Billboard din header
    if (newsBillboard) {
        newsBillboard.textContent = `Sezon: ${gameState.currentSeason}, Ziua: ${gameState.currentMatchday}. Ultimele știri despre Liga Galactică!`;
    } else {
        console.warn("main.js: Elementul '#news-billboard' nu a fost găsit în header.");
    }

    console.log(`main.js: updateHeaderInfo() - Header actualizat. Emblemă: ${gameState.club.emblemUrl}, Nume Club: ${gameState.club.name}, Antrenor: ${gameState.coach.nickname}, Buget: ${gameState.club.funds}`);
}


// Lansează procesul de inițializare când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', () => {
    // Asigură-te că #welcome-screen este cel corect pentru setup
    const welcomeScreenElement = document.getElementById('welcome-screen');
    if (!welcomeScreenElement) {
        console.error("main.js: Elementul '#welcome-screen' nu a fost găsit la încărcarea DOM-ului. Aplicația nu poate porni.");
        document.body.innerHTML = `<p class="error-message">Eroare critică: Elementul principal al aplicației nu a fost găsit. Vă rugăm să verificați index.html.</p>`;
        return;
    }
    initializeGame();
});
