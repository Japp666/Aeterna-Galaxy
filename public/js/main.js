// js/main.js - Logica principală a aplicației

import { getGameState, updateGameState } from './game-state.js';
import { generateInitialPlayers } from './team.js'; // Importă generateInitialPlayers din team.js
import { initUI } from './game-ui.js'; // CORECTAT: Acum importăm initUI, nu initGameUI
import { initTeamTab } from './team.js'; // Importăm initTeamTab direct aici pentru a fi disponibilă dacă e nevoie

// Referințe la elemente DOM din index.html
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const clubNameInput = document.getElementById('club-name-input');
const coachNameInput = document.getElementById('coach-name-input');
const startGameBtn = document.getElementById('start-game-btn');

/**
 * Inițializează jocul la pornire, verificând starea salvată.
 */
function initializeGame() {
    const gameState = getGameState();

    if (gameState && gameState.isGameStarted) {
        console.log("Stare joc încărcată din localStorage.");
        console.log("Stare joc încărcată:", gameState);
        showGameScreen();
    } else {
        console.log("Nicio stare de joc salvată. Se afișează ecranul de setup.");
        showSetupScreen();
    }
}

/**
 * Afișează ecranul de setup al jocului.
 */
function showSetupScreen() {
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        startGameBtn.addEventListener('click', startGame);
    } else {
        console.error("Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

/**
 * Afișează ecranul principal al jocului.
 */
function showGameScreen() {
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex'; // Sau 'block', depinde de CSS
        initUI(); // Inițializează interfața utilizatorului (meniuri, tab-uri)
        console.log("Jocul a pornit!");
    } else {
        console.error("Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
}

/**
 * Pornește un joc nou, salvează starea inițială și afișează ecranul de joc.
 */
function startGame() {
    const clubName = clubNameInput.value.trim();
    const coachName = coachNameInput.value.trim();

    if (!clubName || !coachName) {
        alert("Te rog completează atât numele clubului, cât și numele antrenorului.");
        return;
    }

    const initialPlayers = generateInitialPlayers(25); // Generează 25 de jucători
    console.log("Jucători inițiali generați:", initialPlayers);


    const newGameState = {
        isGameStarted: true,
        club: {
            name: clubName,
            money: 10000000, // Capital inițial
            fans: 10000,
            facilities: {
                training: 1,
                youthAcademy: 1,
                stadium: 1
            }
        },
        coach: {
            name: coachName,
            reputation: 50 // Reputație inițială
        },
        players: initialPlayers, // Adaugă jucătorii generați în stare
        currentSeason: 1,
        currentDay: 1,
        currentFormation: '4-4-2', // Formație default
        currentMentality: 'normal' // Mentalitate default
    };

    updateGameState(newGameState);
    showGameScreen();
}

// Inițializează jocul la încărcarea paginii
document.addEventListener('DOMContentLoaded', initializeGame);
