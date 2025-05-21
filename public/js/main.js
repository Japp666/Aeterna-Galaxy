// js/main.js

import { loadGame, saveGame, getPlayerName, getPlayerRace, resetGame } from './user.js';
import { updateHUD, setupProductionInterval } from './hud.js';
import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { renderMap } from './map.js';
import { renderFleet } from './fleet.js';
import { showNameModal, showRaceSelectionScreen } from './utils.js'; // Assurez-vous que showNameModal est importé

// Selectors for navigation buttons
const navBuildingsBtn = document.getElementById('nav-buildings');
const navResearchBtn = document.getElementById('nav-research');
const navMapBtn = document.getElementById('nav-map');
const navFleetBtn = document.getElementById('nav-fleet');
const resetGameBtn = document.getElementById('reset-game-button');

// Main game initialization function
function initGame() {
    // Load game data
    loadGame(); // This will also call updateHUD internally

    // Check if player name is set, if not, show modal
    if (!getPlayerName()) {
        showNameModal();
    } else if (!getPlayerRace()) {
        // If name is set but race isn't, show race selection
        showRaceSelectionScreen();
    } else {
        // If both are set, display default content (e.g., buildings)
        renderBuildings(); // Display buildings by default
    }

    // Setup event listeners for navigation
    navBuildingsBtn.addEventListener('click', renderBuildings);
    navResearchBtn.addEventListener('click', renderResearch);
    navMapBtn.addEventListener('click', renderMap);
    navFleetBtn.addEventListener('click', renderFleet);
    resetGameBtn.addEventListener('click', () => {
        if (confirm("Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!")) {
            resetGame();
            window.location.reload(); // Reîncarcă pagina după resetare
        }
    });

    // Start resource production interval
    setupProductionInterval();

    // Initial HUD update after everything is loaded
    // This is called by loadGame(), but an extra call here ensures fresh data
    updateHUD();
}

// Ensure DOM is fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', initGame);

// Auto-save game every 30 seconds
setInterval(saveGame, 30000);
