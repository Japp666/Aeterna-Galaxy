// js/main.js

import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { renderMap } from './map.js';
import { renderFleet } from './fleet.js'; // Asigură-te că renderFleet este importat
// Importă toate funcțiile necesare din user.js, inclusiv updateResources
import { loadGame, saveGame, getUserData, getPlayerName, setPlayerName, getPlayerRace, setPlayerRace, updateResources, resetGame } from './user.js';
import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

// Verifică aici dacă modalul de nume ar trebui să apară
window.addEventListener('DOMContentLoaded', () => {
    loadGame(); // Încarcă datele salvate

    const userData = getUserData();
    if (!userData.playerName || !userData.playerRace) {
        showNameRaceModal();
    } else {
        updateHUD(); // Actualizează HUD-ul dacă datele sunt deja setate
        // Set up initial view (e.g., buildings)
        renderBuildings(); // Afișează clădirile la început
    }

    // Set up navigation
    document.getElementById('nav-buildings').addEventListener('click', renderBuildings);
    document.getElementById('nav-research').addEventListener('click', renderResearch);
    document.getElementById('nav-map').addEventListener('click', renderMap);
    document.getElementById('nav-fleet').addEventListener('click', renderFleet); // Adaugă ascultător pentru navigația către flotă

    // Set up reset game button
    document.getElementById('reset-game-button').addEventListener('click', resetGame);
});

function showNameRaceModal() {
    const modal = document.getElementById('name-race-modal');
    // Verifică dacă modalul există înainte de a accesa proprietăți
    if (modal) {
        modal.style.display = 'block';

        const saveButton = document.getElementById('save-name-race');
        if (saveButton) { // Asigură-te că butonul există
            saveButton.onclick = () => {
                const playerNameInput = document.getElementById('player-name-input');
                const playerRaceSelect = document.getElementById('player-race-select');

                const name = playerNameInput.value.trim();
                const race = playerRaceSelect.value;

                if (name && race) {
                    setPlayerName(name); // Folosește setPlayerName
                    setPlayerRace(race); // Folosește setPlayerRace
                    modal.style.display = 'none';
                    updateHUD();
                    renderBuildings(); // Afișează clădirile după salvare
                    showMessage("Numele și rasa au fost salvate!", "success");
                } else {
                    showMessage("Te rog introdu un nume și selectează o rasă.", "error");
                }
            };
        } else {
            console.error("Butonul 'save-name-race' nu a fost găsit în DOM.");
        }
    } else {
        console.error("Modalul 'name-race-modal' nu a fost găsit în DOM.");
    }
}

// Global function to reset game (can be called from console)
// resetGame este deja importat de sus, nu mai trebuie importat din nou
window.resetGame = resetGame;

// Update resources every second (for real-time production)
setInterval(() => {
    const userData = getUserData();
    const production = userData.production;

    // Convert hourly production to per-second production
    const metalPerSecond = production.metal / 3600;
    const crystalPerSecond = production.crystal / 3600;
    const energyPerSecond = production.energy / 3600;
    const heliumPerSecond = production.helium / 3600;

    // Update resources for 1 second
    updateResources(metalPerSecond, crystalPerSecond, energyPerSecond, heliumPerSecond);
}, 1000);
