// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initGameUI, displayTab } from './game-ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameState = initializeGameState();
    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');

    function onGameStarted() {
        console.log("Jocul a pornit!");

        setupScreen.style.display = 'none';
        gameContainer.style.display = 'flex';

        document.getElementById('header-club-emblem').src = getGameState().club.emblemUrl;
        document.getElementById('header-club-name').textContent = getGameState().club.name;
        // CORECTIE AICI: Nu mai adăugăm "Euro" aici, deoarece este deja în HTML
        // textContent = getGameState().club.funds.toLocaleString('ro-RO') + ' Euro';
        document.getElementById('header-club-funds').textContent = getGameState().club.funds.toLocaleString('ro-RO'); // MODIFICAT: Eliminat concatenarea ' Euro'
        document.getElementById('header-coach-nickname').textContent = getGameState().coach.nickname;
        document.getElementById('header-season').textContent = getGameState().currentSeason;
        document.getElementById('header-day').textContent = getGameState().currentDay;

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
