// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initGameUI, displayTab } from './game-ui.js'; // NOU: Importăm funcțiile UI

document.addEventListener('DOMContentLoaded', () => {
    const gameState = initializeGameState();
    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');

    /**
     * Funcție apelată după ce jocul este pornit de pe ecranul de setup.
     */
    function onGameStarted() {
        console.log("Jocul a pornit!");

        // Ascunde ecranul de setup și arată containerul jocului
        setupScreen.style.display = 'none';
        gameContainer.style.display = 'flex'; // Folosim flex pentru layout vertical

        // Populează informațiile din header
        document.getElementById('header-club-emblem').src = getGameState().club.emblemUrl;
        document.getElementById('header-club-name').textContent = getGameState().club.name;
        document.getElementById('header-club-funds').textContent = getGameState().club.funds.toLocaleString('ro-RO'); // Formatare numerica
        document.getElementById('header-coach-nickname').textContent = getGameState().coach.nickname;
        document.getElementById('header-season').textContent = getGameState().currentSeason;
        document.getElementById('header-day').textContent = getGameState().currentDay;

        // Inițializează UI-ul jocului (meniul și conținutul tab-urilor)
        initGameUI();
        displayTab('dashboard'); // Afișează dashboard-ul ca tab implicit la început
    }

    // Verifică dacă jocul a fost deja pornit și salvat
    if (gameState.isGameStarted) {
        onGameStarted(); // Inițializează jocul direct
    } else {
        // Altfel, arată ecranul de setup
        setupScreen.style.display = 'flex'; // Folosim flex pentru setup-container pentru centrare
        gameContainer.style.display = 'none';
        initSetupScreen(onGameStarted); // Inițializează logica ecranului de setup
    }
});
