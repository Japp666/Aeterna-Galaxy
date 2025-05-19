import { user } from './user.js';
import { showMenu } from './menu.js';
import { showHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showResearch } from './research.js';
import { initMap } from './map.js';
import { showFleet } from './fleet.js';

// Începerea jocului
window.startGame = function () {
    const nameInput = document.getElementById('commanderName');
    if (!nameInput || nameInput.value.trim() === '') {
        alert("Introdu numele comandantului.");
        return;
    }
    
    user.name = nameInput.value.trim();
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameInterface').classList.remove('hidden');
    
    showMenu();
    showHUD();
    showBuildings();
    showResearch();
    initMap();
    showFleet();
};
