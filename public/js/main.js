// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState, updateGameState } from './game-state.js';
import { initSetupScreen } from './setup.js'; // Importă inițializarea ecranului de setup
import { initUI } from './game-ui.js'; // CORECTAT: Importă initUI din game-ui.js
import { generateInitialPlayers } from './player-generator.js'; // Importă generateInitialPlayers

// Referințe la elemente DOM (actualizate pentru claritate și pentru a corespunde cu index.html)
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen'); // Acesta este game-container din HTML
const coachNicknameInput = document.getElementById('coach-nickname');
const clubNameInput = document.getElementById('club-name');
const startGameBtn = document.getElementById('start-game-btn');


/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
function initializeGame() {
    const gameState = initializeGameState(); // Se încarcă starea sau se creează una nouă

    // Verificăm dacă jocul este deja pornit
    if (gameState.isGameStarted) {
        console.log("Stare joc încărcată din localStorage. Se afișează ecranul jocului.");
        showGameScreen();
    } else {
        console.log("Nicio stare de joc salvată. Se afișează ecranul de setup.");
        showSetupScreen();
    }
}

/**
 * Afișează ecranul de setup al jocului și inițializează logica specifică.
 */
function showSetupScreen() {
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        initSetupScreen(onSetupComplete); // Inițializăm ecranul de setup și îi pasăm un callback
    } else {
        console.error("Elementele setupScreen sau gameScreen nu au fost găsite în showSetupScreen.");
    }
}

/**
 * Afișează ecranul principal al jocului și inițializează UI-ul principal.
 */
function showGameScreen() {
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        initGameUIComponents(); // Inițializează toate componentele UI ale jocului
    } else {
        console.error("Elementele setupScreen sau gameScreen nu au fost găsite în showGameScreen.");
    }
}

/**
 * Callback apelat după ce setup-ul este complet și jocul pornește.
 */
function onSetupComplete() {
    console.log("Setup-ul este complet. Se pregătesc jucătorii și se afișează jocul.");

    // Generăm jucătorii inițiali doar la prima pornire a jocului
    const currentGameState = getGameState();
    if (currentGameState.players.length === 0) { // Asigură-te că generezi jucători doar dacă nu există
        const initialPlayers = generateInitialPlayers(25);
        updateGameState({
            players: initialPlayers,
            isGameStarted: true, // Asigurăm că isGameStarted este setat pe true aici
            currentFormation: currentGameState.currentFormation || '4-4-2', // Păstrează sau setează o formație default
            currentMentality: currentGameState.currentMentality || 'normal' // Păstrează sau setează o mentalitate default
        });
        console.log("Jucători inițiali generați și stare actualizată.");
    } else {
         updateGameState({ isGameStarted: true }); // Dacă avea deja jucători dar isGameStarted era false
    }


    initGameUIComponents(); // Inițializează componentele UI după generarea jucătorilor și actualizarea stării
    // Aici vom actualiza și informațiile din header
    updateHeaderInfo();
}


/**
 * Funcție auxiliară pentru a actualiza informațiile din header-ul jocului.
 */
function updateHeaderInfo() {
    const currentGameState = getGameState();
    document.getElementById('header-club-emblem').src = currentGameState.club.emblemUrl;
    document.getElementById('header-club-name').textContent = currentGameState.club.name;
    document.getElementById('header-club-funds').textContent = currentGameState.club.funds.toLocaleString('ro-RO'); // ' Euro' este deja în HTML
    document.getElementById('header-coach-nickname').textContent = currentGameState.coach.nickname;
    document.getElementById('header-season').textContent = currentGameState.currentSeason;
    document.getElementById('header-day').textContent = currentGameState.currentDay;
}


/**
 * Inițializează toate componentele UI ale jocului după ce jocul a început sau a fost reîncărcat.
 * Aceasta funcție va fi apelată atât la prima pornire, cât și la revenirea dintr-o salvare.
 */
function initGameUIComponents() {
    initUI(); // Inițializează meniul principal (care apoi încarcă tab-ul Dashboard/Team)
    updateHeaderInfo(); // Asigură că header-ul e actualizat
}

// Lansează procesul de inițializare când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', initializeGame);
