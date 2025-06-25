import { initializeGameState, getGameState, updateGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js'; // Asigură-te că inițierea UI-ului se face de aici
import { generateInitialPlayers } from './player-generator.js';

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');

function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");
    const gameState = initializeGameState(); // Aceasta va încărca starea sau o va crea
    console.log("main.js: initializeGame() - Stare inițială a jocului. isGameStarted:", gameState.isGameStarted);

    if (gameState.isGameStarted) {
        console.log("main.js: initializeGame() - Stare joc încărcată din localStorage. isGameStarted este TRUE. Se afișează ecranul jocului.");
        showGameScreen();
    } else {
        console.log("main.js: initializeGame() - Nici o stare de joc salvată sau isGameStarted este FALSE. Se afișează ecranul de setup.");
        showSetupScreen();
    }
}

function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de setup.");
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        initSetupScreen(onSetupComplete); // Aici se pasează callback-ul
        console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat cu onSetupComplete ca callback.");
    } else {
        console.error("main.js: showSetupScreen() - Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

function showGameScreen() {
    console.log("main.js: showGameScreen() - Se afișează ecranul jocului.");
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        initGameUIComponents(); // Aici se inițializează UI-ul jocului principal
        console.log("main.js: showGameScreen() - initGameUIComponents a fost apelat.");
    } else {
        console.error("main.js: showGameScreen() - Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

function onSetupComplete() {
    console.log("main.js: onSetupComplete() - Funcția de callback onSetupComplete a fost apelată!");
    const currentGameState = getGameState();
    console.log("main.js: onSetupComplete() - Stare joc curentă (după setup - AR TREBUI SĂ FIE ACTUALIZATĂ CU DATELE DE SETUP):", currentGameState);

    // Asigură-te că jucătorii sunt generați doar la primul start al jocului
    if (currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers,
            // Asigură-te că aceste valori sunt setate corespunzător la primul start
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

function updateHeaderInfo() {
    console.log("main.js: updateHeaderInfo() - Actualizez informațiile din header.");
    const currentGameState = getGameState();
    const headerClubEmblem = document.getElementById('header-club-emblem');
    const headerClubName = document.getElementById('header-club-name');
    const headerClubFunds = document.getElementById('header-club-funds');
    const headerCoachNickname = document.getElementById('header-coach-nickname');
    const headerSeason = document.getElementById('header-season');
    const headerDay = document.getElementById('header-day');

    // Asigură-te că elementele există înainte de a încerca să le manipulezi
    if (headerClubEmblem) headerClubEmblem.src = currentGameState.club.emblemUrl;
    if (headerClubName) headerClubName.textContent = currentGameState.club.name;
    if (headerClubFunds) headerClubFunds.textContent = currentGameState.club.funds.toLocaleString('ro-RO');
    if (headerCoachNickname) headerCoachNickname.textContent = currentGameState.coach.nickname;
    if (headerSeason) headerSeason.textContent = currentGameState.currentSeason;
    if (headerDay) headerDay.textContent = currentGameState.currentDay;
    console.log("main.js: updateHeaderInfo() - Header actualizat. Emblemă:", currentGameState.club.emblemUrl, "Nume:", currentGameState.club.name);
}

function initGameUIComponents() {
    console.log("main.js: initGameUIComponents() - Apelând initUI() din game-ui.js.");
    initUI(); // Acum initUI din game-ui.js este apelată aici
    updateHeaderInfo();
    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate. Ar trebui să vezi acum dashboard-ul.");
}

// Așteaptă ca DOM-ul să fie complet încărcat înainte de a inițializa jocul
document.addEventListener('DOMContentLoaded', initializeGame);
