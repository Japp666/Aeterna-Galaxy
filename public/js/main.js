// public/js/main.js

import { getGameState, updateGameState, resetGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

// Elementele principale ale ecranului (acum corespund index.html)
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
// const loadingScreen = document.getElementById('loading-screen'); // Nu este folosit direct, dar păstrat pentru referință dacă e necesar
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
    if (!welcomeScreen || !gameScreen) {
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
    if (resetButton && !resetButton._hasClickListener) { // Evită adăugarea multiplă de listeneri
        resetButton.addEventListener('click', () => {
            if (confirm("Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!")) {
                resetGameState(); // Resetează starea jocului
                showSetupScreen(); // Afișează ecranul de configurare
                console.log("main.js: Jocul a fost resetat.");
            }
        });
        resetButton._hasClickListener = true; // Marchează că listener-ul a fost adăugat
        console.log("main.js: initGameUIComponents() - Listener adăugat la butonul Reset Joc.");
    }
});


/**
 * Afișează ecranul de configurare a jocului și inițializează logica sa.
 * ÎNCARCĂ CONȚINUTUL DINAMIC setup.html!
 */
async function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de configurare.");
    welcomeScreen.classList.remove('hidden'); // Asigură că welcomeScreen este vizibil pentru setup
    gameScreen.classList.add('hidden'); // Ascunde gameScreen

    // Load setup.html content dynamically
    try {
        const response = await fetch('components/setup.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        
        welcomeScreen.innerHTML = htmlContent; // Inject content into welcomeScreen
        console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");

        // Inițializează logica setup.js după ce HTML-ul este injectat
        // Trecem elementul #welcome-screen care acum conține #setup-container
        // și callback-ul onSetupComplete.
        // Folosim setTimeout pentru a asigura că DOM-ul este parsert complet
        setTimeout(() => {
            console.log("main.js: showSetupScreen() - Se inițializează logica setup.js după un scurt delay...");
            initSetupScreen(welcomeScreen, onSetupComplete); // Pass welcomeScreen as the container
            console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat cu welcomeScreen ca element container și onSetupComplete ca callback.");
        }, 50); // Un delay scurt pentru a permite browserului să randeze DOM-ul

    } catch (error) {
        console.error("main.js: Eroare la încărcarea conținutului setup.html:", error);
        welcomeScreen.innerHTML = `<p class="error-message">Eroare la încărcarea ecranului de setup: ${error.message}</p>`;
    }
}


/**
 * Afișează ecranul principal al jocului și inițializează UI-ul și informațiile.
 */
function showGameScreen() {
    console.log("main.js: showGameScreen() - Se afișează ecranul jocului.");
    welcomeScreen.classList.add('hidden'); // Ascunde welcomeScreen
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

    // Generează jucători inițiali doar dacă nu există deja
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

    // Nota: Listenerul pentru resetButton este adăugat în `DOMContentLoaded` pentru a fi disponibil mai devreme
    // dar se asigură că nu este adăugat de mai multe ori.
    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate. Ar trebui să vezi acum dashboard-ul.");
}

/**
 * Actualizează informațiile afișate în header (Nume Club, Antrenor, Buget, Emblemă, Sezon/Ziua).
 */
export function updateHeaderInfo() {
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const gameState = getGameState();

    // Verificăm existența elementelor și a datelor din gameState înainte de a le accesa
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
