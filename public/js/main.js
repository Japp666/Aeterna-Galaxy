// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState, updateGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initUI } from './game-ui.js';
import { generateInitialPlayers } from './player-generator.js';

// Referințe la elemente DOM
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
// Nu mai avem nevoie de referințe directe la input-uri sau buton aici, setup.js le gestionează
// const coachNicknameInput = document.getElementById('coach-nickname');
// const clubNameInput = document.getElementById('club-name');
// const startGameBtn = document.getElementById('start-game-btn');


/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");
    const gameState = initializeGameState(); // Se încarcă starea sau se creează una nouă

    if (gameState.isGameStarted) {
        console.log("main.js: initializeGame() - Stare joc încărcată din localStorage. isGameStarted este TRUE.");
        showGameScreen();
    } else {
        console.log("main.js: initializeGame() - Nicio stare de joc salvată sau isGameStarted este FALSE. Se afișează ecranul de setup.");
        showSetupScreen();
    }
}

/**
 * Afișează ecranul de setup al jocului și inițializează logica specifică.
 */
function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de setup.");
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        initSetupScreen(onSetupComplete); // Inițializăm ecranul de setup și îi pasăm un callback
        console.log("main.js: showSetupScreen() - initSetupScreen a fost apelat.");
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
    console.log("main.js: onSetupComplete() - Functia de callback onSetupComplete a fost apelata!");

    const currentGameState = getGameState();
    console.log("main.js: onSetupComplete() - Stare joc curentă (după setup):", currentGameState);

    // Generăm jucătorii inițiali doar la prima pornire a jocului
    if (currentGameState.players.length === 0) {
        console.log("main.js: onSetupComplete() - Generez jucători inițiali (25).");
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers,
            isGameStarted: true,
            currentFormation: currentGameState.currentFormation || '4-4-2',
            currentMentality: currentGameState.currentMentality || 'normal'
        });
        console.log("main.js: onSetupComplete() - Jucători inițiali generați și stare actualizată.");
    } else {
        console.log("main.js: onSetupComplete() - Jucători existenți. Doar actualizez isGameStarted la TRUE.");
        updateGameState({ isGameStarted: true });
    }

    console.log("main.js: onSetupComplete() - Apelând initGameUIComponents...");
    initGameUIComponents(); // Inițializează componentele UI după generarea jucătorilor și actualizarea stării
    updateHeaderInfo(); // Actualizăm informațiile din header
    console.log("main.js: onSetupComplete() - Finalizarea callback-ului onSetupComplete.");
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

    console.log("main.js: updateHeaderInfo() - Header actualizat. Emblemă:", currentGameState.club.emblemUrl);
}


/**
 * Inițializează toate componentele UI ale jocului după ce jocul a început sau a fost reîncărcat.
 */
function initGameUIComponents() {
    console.log("main.js: initGameUIComponents() - Apelând initUI() din game-ui.js.");
    initUI(); // Inițializează meniul principal (care apoi încarcă tab-ul Dashboard/Team)
    updateHeaderInfo(); // Asigură că header-ul e actualizat
    console.log("main.js: initGameUIComponents() - initUI() și updateHeaderInfo() apelate.");
}

// Lansează procesul de inițializare când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', initializeGame);
