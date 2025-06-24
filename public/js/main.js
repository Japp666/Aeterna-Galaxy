// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
// Aici vom importa funcțiile de inițializare pentru celelalte module (dashboard, team, matches etc.) pe măsură ce le vom crea.

document.addEventListener('DOMContentLoaded', () => {
    const gameState = initializeGameState();
    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');

    /**
     * Funcție apelată după ce jocul este pornit de pe ecranul de setup.
     */
    function onGameStarted() {
        console.log("Jocul a pornit!");
        // Aici vei inițializa meniul principal al jocului și vei afișa dashboard-ul
        // Exemplu: renderDashboard(getGameState());
        // Sau: setupMainMenu(); displayTab('dashboard');
        gameContainer.innerHTML = '<h2>Bun venit în Liga Stelară, ' + getGameState().coach.nickname + '!</h2><p>Clubul tău: ' + getGameState().club.name + '</p><img src="' + getGameState().club.emblemUrl + '" alt="Emblema Clubului" style="width: 100px; height: 100px;">';
        // Aceasta este doar o demonstrație. Aici vei încărca layout-ul principal al jocului.
    }

    if (gameState.isGameStarted) {
        // Dacă jocul a fost deja pornit și salvat, ascunde setup-ul și arată direct jocul
        setupScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        onGameStarted(); // Inițializează jocul direct
    } else {
        // Altfel, arată ecranul de setup
        setupScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        initSetupScreen(onGameStarted); // Inițializează logica ecranului de setup
    }
});
