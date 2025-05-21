// js/main.js

import { loadGame, saveGame, getPlayerName, getPlayerRace, resetGame, setUserBuildingLevel, getUserData } from './user.js';
import { updateHUD, setupProductionInterval } from './hud.js';
import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { renderMap } from './map.js';
import { renderFleet } from './fleet.js';
import { showNameModal, showRaceSelectionScreen, showMessage } from './utils.js';

// Selectors for navigation buttons
const navBuildingsBtn = document.getElementById('nav-buildings');
const navResearchBtn = document.getElementById('nav-research');
const navMapBtn = document.getElementById('nav-map');
const navFleetBtn = document.getElementById('nav-fleet');
const resetGameBtn = document.getElementById('reset-game-button');

// Main game initialization function
function initGame() {
    loadGame(); // Încearcă să încarci datele jocului

    const playerName = getPlayerName();
    const playerRace = getPlayerRace();

    if (!playerName) {
        // Dacă numele nu este setat, afișează modalul de nume
        showNameModal().then(() => {
            // După ce numele este salvat (promisiunea rezolvată)
            // Verifică din nou rasa
            if (!getPlayerRace()) {
                showRaceSelectionScreen().then(() => {
                    // După ce rasa este selectată
                    initializeGameplay();
                });
            } else {
                initializeGameplay();
            }
        });
    } else if (!playerRace) {
        // Dacă numele este setat, dar rasa nu, afișează selecția de rasă
        showRaceSelectionScreen().then(() => {
            // După ce rasa este selectată
            initializeGameplay();
        });
    } else {
        // Dacă ambele sunt setate, începe jocul normal
        initializeGameplay();
    }

    // Auto-save game every 30 seconds
    setInterval(saveGame, 30000);
}

function initializeGameplay() {
    // Asigură-te că HUD-ul este actualizat după ce toate datele sunt disponibile
    updateHUD();

    // Setup event listeners for navigation
    navBuildingsBtn.addEventListener('click', () => {
        renderBuildings();
        saveGame(); // Salvează jocul la schimbarea secțiunii
    });
    navResearchBtn.addEventListener('click', () => {
        renderResearch();
        saveGame();
    });
    navMapBtn.addEventListener('click', () => {
        renderMap();
        saveGame();
    });
    navFleetBtn.addEventListener('click', () => {
        renderFleet();
        saveGame();
    });
    resetGameBtn.addEventListener('click', () => {
        if (confirm("Ești sigur că vrei să resetezi jocul? Toate progresele vor fi pierdute!")) {
            resetGame();
            window.location.reload(); // Reîncarcă pagina după resetare
        }
    });

    // Start resource production interval
    setupProductionInterval();

    // Afișează conținutul principal default (ex: clădiri)
    renderBuildings();
}


// Ensure DOM is fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', initGame);

// !!! ATENȚIE: FUNCȚII DE TEST PENTRU DEZVOLTARE RAPIDĂ !!!
// Pot fi comentate sau șterse în versiunea finală a jocului.
window.addResources = (metal = 1000, crystal = 500, energy = 200, helium = 50) => {
    const userData = getUserData();
    userData.resources.metal += metal;
    userData.resources.crystal += crystal;
    userData.resources.energy += energy;
    userData.resources.helium += helium;
    saveGame();
    updateHUD();
    showMessage(`Resurse adăugate: Metal +${metal}, Cristal +${crystal}, Energie +${energy}, Heliu +${helium}`, "success");
};

window.setLevel = (buildingId, level) => {
    setUserBuildingLevel(buildingId, level);
    saveGame();
    updateHUD();
    showMessage(`Nivelul clădirii ${buildingId} setat la ${level}`, "success");
};
