import { user, showMessage } from './user.js';
import { showHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showResearch } from './research.js';
import { initMap } from './map.js';
import { showFleet } from './fleet.js';

window.startGame = function () {
    const nameInput = document.getElementById('commanderName');
    if (!nameInput || nameInput.value.trim() === '') {
        alert("Introdu numele comandantului.");
        return;
    }

    user.name = nameInput.value.trim();
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameInterface').classList.remove('hidden');

    showHUD();
    showBuildings();
    showResearch();
    initMap();
    showFleet();
    showMenu();
};

function showMenu() {
    const menuContainer = document.getElementById('menu');
    if (!menuContainer) {
        console.error("Elementul #menu nu a fost găsit.");
        return;
    }

    menuContainer.innerHTML = `
        <div class="menu-bar">
            <button onclick="switchTab('buildings')">Clădiri</button>
            <button onclick="switchTab('research')">Cercetare</button>
            <button onclick="switchTab('map')">Harta</button>
            <button onclick="switchTab('fleet')">Flotă</button>
            <button onclick="switchTab('shipyard')">Construcție Nave</button>
        </div>
    `;
}

window.switchTab = function(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.add('hidden'));

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.remove('hidden');
    } else {
        console.error(`Tab-ul ${tabId} nu a fost găsit.`);
    }
};
