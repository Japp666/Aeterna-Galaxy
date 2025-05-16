import { user } from './user.js';
import { initializeHUD, updateHUD } from './hud.js';
import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { handleOfflineProduction } from './utils.js';

// ⏳ Când DOM-ul e gata, atașăm evenimente
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('button[onclick="startGame()"]');
  if (loginBtn) loginBtn.addEventListener('click', startGame);
});

window.startGame = function () {
  const input = document.getElementById('commanderName');
  if (!input) {
    console.error('Inputul cu ID commanderName nu a fost găsit.');
    return;
  }

  const name = input.value.trim();
  if (!name) {
    alert('Introdu un nume de comandant!');
    return;
  }

  user.name = name;

  // Ascunde loginul, arată selecția de rasă
  document.getElementById('loginScreen')?.classList.add('hidden');
  document.getElementById('raceSelection')?.classList.remove('hidden');
};

window.selectRace = function (race) {
  user.race = race;
  user.resources = {
    metal: 1000,
    crystal: 1000,
    energy: 1000
  };

  document.getElementById('raceSelection')?.classList.add('hidden');
  document.getElementById('hud')?.classList.remove('hidden');
  document.getElementById('gameContent')?.classList.remove('hidden');

  initializeHUD();
  renderBuildings();
  renderResearch();
  updateHUD();
  handleOfflineProduction();
  showTab('buildingsTab');
};

window.showTab = function (tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.add('hidden'));

  const selected = document.getElementById(tabId);
  if (selected) selected.classList.remove('hidden');
};

window.addEventListener('beforeunload', () => {
  user.lastOnline = Date.now();
});
