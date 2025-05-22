// public/js/main.js
import { showNameModal, showRaceSelectionScreen } from './utils.js';
import { getPlayerName, getPlayerRace, saveGameState } from './user.js';
import { updateHUD } from './hud.js';
import { loadTabContent } from './menu.js';
import { initBotAI } from './bot.js'; // Asigură-te că importezi funcția, chiar dacă nu o folosești direct aici

document.addEventListener('DOMContentLoaded', async () => {
    // Încarcă HUD-ul inițial
    await loadTabContent('hud', 'hud'); // Asigură-te că HUD-ul e încărcat

    let playerName = getPlayerName();
    let playerRace = getPlayerRace();

    // TEMPORAR PENTRU DEZVOLTARE: Forțează resetarea sau afișarea modalurilor
    // Poți descomenta una dintre liniile de mai jos sau pe amândouă în timpul dezvoltării.
    // DUPĂ DEZVOLTARE, ASIGURĂ-TE CĂ LE COMENTEZI LA LOC!
    // localStorage.clear(); // Asta va șterge TOATE datele salvate la fiecare refresh
    // playerName = null; // Forțează afișarea modalului de nume
    // playerRace = null; // Forțează afișarea modalului de rasă

    if (!playerName) {
        await showNameModal();
        playerName = getPlayerName(); // Re-citește numele după ce a fost salvat
        updateHUD(); // Actualizează HUD-ul cu noul nume
    }

    if (!playerRace) {
        await showRaceSelectionScreen();
        playerRace = getPlayerRace(); // Re-citește rasa după ce a fost salvată
        updateHUD(); // Actualizează HUD-ul cu noua rasă
    }

    // După ce numele și rasa sunt setate, inițializează restul jocului
    updateHUD(); // Asigură-te că HUD-ul este actualizat cu toate informațiile
    loadTabContent('home'); // Încarcă tab-ul Home implicit
    initBotAI(); // Inițializează inteligența artificială a boților
});
