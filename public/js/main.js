import { showRaceSelectionScreen, showMessage } from './utils.js';
import { getPlayerName, getPlayerRace, loadPlayerData } from './user.js';
import { updateHUD } from './hud.js';
import { loadTabContent } from './menu.js';
import { initBotAI } from './bot.js';
import { showNicknameModal } from './login.js';

async function initializeGame() {
    await showNicknameModal();
    const playerName = getPlayerName();
    const playerRace = getPlayerRace();

    if (!playerRace) {
        await showRaceSelectionScreen();
        updateHUD();
    }

    await loadTabContent('hud', 'hud');
    loadTabContent('home');
    initBotAI();
    showMessage(`Jocul a pornit! Bun venit, ${playerName} al rasei ${playerRace || 'necunoscute'}!`, 'success');
}

initializeGame();
