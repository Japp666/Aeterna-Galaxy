// js/main.js - Logica principală a aplicației

import { initializeGameState, getGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initGameUI, displayTab } from './game-ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Întotdeauna inițializăm starea jocului la încărcarea paginii
    // Aceasta va încărca o stare salvată dacă există, sau va crea una nouă
    const gameState = initializeGameState();

    const setupScreen = document.getElementById('setup-screen');
    const gameContainer = document.getElementById('game-container');

    /**
     * Funcție apelată după ce jocul este pornit de pe ecranul de setup SAU încărcat dintr-o salvare.
     */
    function onGameStarted() {
        console.log("Jocul a pornit!");

        // Ascunde ecranul de setup și arată containerul jocului
        setupScreen.style.display = 'none';
        gameContainer.style.display = 'flex'; // Folosim flex pentru layout vertical

        // Populează informațiile din header
        document.getElementById('header-club-emblem').src = getGameState().club.emblemUrl;
        document.getElementById('header-club-name').textContent = getGameState().club.name;
        document.getElementById('header-club-funds').textContent = getGameState().club.funds.toLocaleString('ro-RO') + ' Euro'; // Adaugă "Euro" direct aici
        document.getElementById('header-coach-nickname').textContent = getGameState().coach.nickname;
        document.getElementById('header-season').textContent = getGameState().currentSeason;
        document.getElementById('header-day').textContent = getGameState().currentDay;

        // Inițializează UI-ul jocului (meniul și conținutul tab-urilor)
        initGameUI(); // Nu mai pasăm callback-ul, deoarece resetarea face un reload complet
        displayTab('dashboard'); // Afișează dashboard-ul ca tab implicit la început
    }

    // Logica principală pentru a decide ce ecran să afișăm la startup
    if (gameState.isGameStarted) {
        onGameStarted(); // Jocul a fost deja început, mergem direct la UI-ul principal
    } else {
        // Jocul nu a fost început încă, arată ecranul de setup
        setupScreen.style.display = 'flex'; // Asigură că setup-screen e flex pentru aliniere
        gameContainer.style.display = 'none';
        // Inițializează logica ecranului de setup, pasând callback-ul pentru când setup-ul e gata
        initSetupScreen(onGameStarted);
    }
});
