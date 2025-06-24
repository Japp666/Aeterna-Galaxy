// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState, updateGameState } from './game-state.js'; // Adăugăm updateGameState
import { initSetupScreen } from './setup.js';
import { initGameUI, displayTab } from './game-ui.js';
import { generateInitialPlayers } from './team.js'; // NOU: Vom importa funcția de generare jucători

document.addEventListener('DOMContentLoaded', () => {
    let gameState = initializeGameState(); // Inițializăm starea

    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');

    function onGameStarted() {
        console.log("Jocul a pornit!");

        // Dacă jocul pornește pentru prima dată (nu dintr-o stare salvată), generează jucătorii inițiali
        if (!gameState.isGameStarted && getGameState().players.length === 0) {
            const players = generateInitialPlayers(25); // Generează 25 de jucători
            updateGameState({ players: players, isGameStarted: true }); // Actualizează starea cu jucătorii și setează isGameStarted la true
            gameState = getGameState(); // Reîncarcă gameState pentru a reflecta schimbările
            console.log("Jucători inițiali generați:", gameState.players);
        }

        setupScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        document.getElementById('header-club-emblem').src = gameState.club.emblemUrl;
        document.getElementById('header-club-name').textContent = gameState.club.name;
        document.getElementById('header-club-funds').textContent = gameState.club.funds.toLocaleString('ro-RO');
        document.getElementById('header-coach-nickname').textContent = gameState.coach.nickname;
        document.getElementById('header-season').textContent = gameState.currentSeason;
        document.getElementById('header-day').textContent = gameState.currentDay;

        initGameUI();
        displayTab('dashboard');
    }

    if (gameState.isGameStarted) {
        onGameStarted();
    } else {
        setupScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
        initSetupScreen(onGameStarted);
    }
});
