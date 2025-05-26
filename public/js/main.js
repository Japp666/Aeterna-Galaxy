import { getPlayer, setPlayerName } from './user.js';
import { showRaceSelectionScreen } from './utils.js';
import { initBuildingsPage } from './buildings.js';
import { updateHUD } from './hud.js';

async function initializeGame() {
    try {
        await setPlayerName('TestPlayer'); // Setăm nickname-ul
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'block'; // Asigurăm vizibilitatea
        } else {
            console.error("Elementul #game-container nu a fost găsit.");
        }
        await showRaceSelectionScreen(); // Afișăm selecția rasei
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
