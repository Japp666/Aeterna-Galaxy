// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState, updateGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initGameUI, displayTab } from './game-ui.js';
import { generateInitialPlayers } from './team.js'; // Vom importa funcția de generare jucători

document.addEventListener('DOMContentLoaded', () => {
    let gameState = initializeGameState(); // Inițializăm starea

    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');

    function onGameStarted() {
        console.log("Jocul a pornit!");

        // Această logică se execută doar la prima pornire a jocului (din setup)
        // SAU dacă starea a fost resetată complet (fără jucători)
        if (!getGameState().isGameStarted || getGameState().players.length === 0) {
            console.log("Se generează jucătorii inițiali pentru un joc nou.");
            const players = generateInitialPlayers(25); // Generează 25 de jucători
            // ATENTIE: UpdateGameState va re-salva starea, asigurându-ne că e salvată o singură dată
            updateGameState({
                players: players,
                isGameStarted: true // Marcăm jocul ca pornit după generarea jucătorilor
            });
            gameState = getGameState(); // Reîncarcă gameState pentru a reflecta schimbările din localStorage
        }

        setupScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        // Afișează informațiile din header din starea *actualizată* a jocului
        document.getElementById('header-club-emblem').src = gameState.club.emblemUrl;
        document.getElementById('header-club-name').textContent = gameState.club.name;
        document.getElementById('header-club-funds').textContent = gameState.club.funds.toLocaleString('ro-RO') + ' Euro';
        document.getElementById('header-coach-nickname').textContent = gameState.coach.nickname;
        document.getElementById('header-season').textContent = gameState.currentSeason;
        document.getElementById('header-day').textContent = gameState.currentDay;

        initGameUI();
        displayTab('dashboard'); // Afiseaza initial dashboard-ul
    }

    // Logică pentru a determina dacă se afișează ecranul de setup sau jocul
    if (gameState.isGameStarted) {
        onGameStarted();
    } else {
        setupScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
        // initSetupScreen setează isGameStarted la true și apoi apelează onGameStarted
        initSetupScreen(onGameStarted);
    }
});
