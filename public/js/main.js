// public/js/main.js - Punctul de intrare principal al jocului

import { showNameModal, showRaceSelectionScreen, showMessage } from './utils.js';
import { getPlayerName, getPlayerRace, saveGameState, resetGameData } from './user.js';
import { updateHUD } from './hud.js';
import { loadTabContent } from './menu.js';
import { initBotAI } from './bot.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM content loaded. Starting game initialization...");

    // Asigură-te că HUD-ul este încărcat imediat, chiar dacă nu este populat complet
    // Acest lucru asigură că elementele HUD există înainte de orice actualizare.
    await loadTabContent('hud', 'hud');

    // --- SECȚIUNE PENTRU DEZVOLTARE/TESTARE ---
    // Decomentează liniile de mai jos DOAR în timpul dezvoltării
    // pentru a forța afișarea modalurilor de nume/rasă la fiecare refresh.
    // Asigură-te să le comentezi la loc înainte de a considera jocul "terminat"
    // sau de a-l distribui, pentru a permite salvarea permanentă a datelor.

    // localStorage.clear(); // Șterge toate datele din localStorage la fiecare refresh (resetare completă)
    // resetGameData(); // Șterge doar datele specifice jocului (nume, rasă, resurse etc.)

    // Forțează afișarea modalului de nume, chiar dacă numele este salvat.
    // let playerName = null; // Aici suprascrii valoarea citită din localStorage
    // Forțează afișarea modalului de rasă, chiar dacă rasa este salvată.
    // let playerRace = null; // Aici suprascrii valoarea citită din localStorage

    // --- SFÂRȘIT SECȚIUNE DEZVOLTARE ---


    let playerName = getPlayerName();
    let playerRace = getPlayerRace();

    // Verifică dacă jucătorul are un nume. Dacă nu, afișează modalul de nume.
    if (!playerName) {
        console.log("Player name not found. Showing name modal.");
        await showNameModal();
        // După ce modalul este închis și numele este salvat, re-citește numele
        playerName = getPlayerName();
        updateHUD(); // Actualizează HUD-ul cu numele nou
    }

    // Verifică dacă jucătorul are o rasă selectată. Dacă nu, afișează modalul de selecție rasă.
    if (!playerRace) {
        console.log("Player race not found. Showing race selection screen.");
        await showRaceSelectionScreen();
        // După ce modalul este închis și rasa este salvată, re-citește rasa
        playerRace = getPlayerRace();
        updateHUD(); // Actualizează HUD-ul cu rasa nouă
    }

    // Odată ce numele și rasa sunt setate (fie nou, fie încărcate), continuă inițializarea jocului.
    console.log(`Game started for: ${playerName} (${playerRace})`);

    updateHUD(); // Asigură-te că HUD-ul este actualizat cu toate informațiile complete
    loadTabContent('home'); // Încarcă tab-ul 'Home' ca pagină implicită la pornirea jocului
    initBotAI(); // Inițializează inteligența artificială a boților
    showMessage(`Jocul a pornit! Bun venit, ${playerName} al rasei ${playerRace}!`, 'success');

    // Salvează starea inițială a jocului (sau cea încărcată)
    saveGameState();
});
