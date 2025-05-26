import { getPlayer, setPlayerName } from './user.js';
import { showRaceSelectionScreen } from './utils.js';
import { initBuildingsPage } from './buildings.js';
import { updateHUD } from './hud.js';

async function initializeGame() {
    try {
        const player = getPlayer();
        // Setăm un nickname implicit pentru a sări peste login
        if (!player.name) {
            await setPlayerName('TestPlayer');
            await showRaceSelectionScreen();
        }
        updateHUD();
        initBuildingsPage();
        console.log("Joc inițializat cu succes!");
    } catch (error) {
        console.error("Eroare la inițializarea jocului:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});
