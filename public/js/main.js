// public/js/main.js - Punctul de intrare principal al jocului

import { showNameModal, showRaceSelectionScreen, showMessage } from './utils.js';
import { getPlayerName, getPlayerRace } from './user.js'; // Am eliminat saveGameState, resetGameData
import { updateHUD } from './hud.js';
import { loadTabContent } from './menu.js';
import { initBotAI } from './bot.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM content loaded. Starting game initialization...");

    // Pas 1: ÎNCARCĂ HUD-UL
    // Asigură-te că elementele HTML ale HUD-ului sunt în DOM.
    await loadTabContent('hud', 'hud'); // Aceasta încarcă hud.html în <header id="hud">

    // Deoarece am eliminat salvarea, vom considera întotdeauna că jucătorul este nou
    // și îi vom cere numele și rasa la fiecare pornire.
    let playerName = null;
    let playerRace = null;

    // Pas 2: SOLICITĂ NUMELE JUCĂTORULUI
    console.log("Showing name modal (game reset on refresh).");
    await showNameModal();
    // După ce modalul este închis și numele este setat, re-citește-l
    playerName = getPlayerName();
    updateHUD(); // Actualizează HUD-ul cu numele nou

    // Pas 3: SOLICITĂ RASA JUCĂTORULUI
    console.log("Showing race selection screen (game reset on refresh).");
    await showRaceSelectionScreen();
    // După ce modalul este închis și rasa este setată, re-citește-o
    playerRace = getPlayerRace();
    updateHUD(); // Actualizează HUD-ul cu rasa nouă

    // Pas 4: FINALIZARE INIȚIALIZARE JOC
    console.log(`Game fully initialized for: ${playerName} (${playerRace})`);

    // Asigură-te că HUD-ul este actualizat cu toate informațiile complete
    updateHUD();
    loadTabContent('home'); // Încarcă tab-ul 'Home' ca pagină implicită la pornirea jocului
    initBotAI(); // Inițializează inteligența artificială a boților
    showMessage(`Jocul a pornit! Bun venit, ${playerName} al rasei ${playerRace}!`, 'success');

    // Nu mai apelăm saveGameState() deoarece nu salvăm jocul
});
