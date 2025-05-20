import { user, showMessage } from './user.js';
import { showHUD, updateHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showResearch } from './research.js';
import { initMap } from './map.js';
import { showFleet } from './fleet.js';

function startGame() {
  const nameInput = document.getElementById('commanderName');
  if (!nameInput || nameInput.value.trim() === '') {
    alert("Te rog să introduci numele comandantului.");
    return;
  }
  user.name = nameInput.value.trim();
  // Trecem de la login la pagina de selecție a rasei
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('racePage').classList.remove('hidden');
}

window.startGame = startGame;

function selectRace(race) {
  user.race = race;
  showMessage(`Rasa ${race} selectată!`);
  // După selecție, trecem la pagina principală a jocului
  document.getElementById('racePage').classList.add('hidden');
  document.getElementById('gamePage').classList.remove('hidden');
  
  // Inițializăm interfața jocului:
  showHUD();
  showBuildings();
  showResearch();
  initMap();
  showFleet();
}

window.selectRace = selectRace;

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
