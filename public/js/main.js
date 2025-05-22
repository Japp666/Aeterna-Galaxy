// public/js/main.js
import { showNameModal, showRaceSelectionScreen, showMessage } from './utils.js';
import { getPlayerName, getPlayerRace, loadPlayerData } from './user.js';
import { updateHUD } from './hud.js';
import { loadTabContent } from './menu.js';
import { initBotAI } from './bot.js';
import { auth } from './firebase-config.js';
import { showLoginModal } from './login.js';

auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log(`Utilizator autentificat: ${user.email}`);
        await loadPlayerData();
        const playerName = getPlayerName();
        const playerRace = getPlayerRace();

        if (!playerName) {
            await showNameModal();
            updateHUD();
        }
        if (!playerRace) {
            await showRaceSelectionScreen();
            updateHUD();
        }

        await loadTabContent('hud', 'hud');
        loadTabContent('home');
        initBotAI();
        showMessage(`Jocul a pornit! Bun venit, ${playerName} al rasei ${playerRace}!`, 'success');
    } else {
        await showLoginModal();
    }
});
