import { showHUD, updateHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showResearch } from './research.js';
import { initMap } from './map.js';
import { startBotSimulation } from './bot.js';
import { user } from './utils.js';

window.startGame = () => {
  const nameInput = document.getElementById('commanderName');
  if (!nameInput) return;
  user.name = nameInput.value.trim();
  if (!user.name) return alert("Introdu un nume de comandant.");
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('raceSelection').classList.add('active');
  document.getElementById('mainInterface').classList.remove('hidden');
};

window.selectRace = (raceName) => {
  user.race = raceName;
  document.getElementById('raceSelection').classList.remove('active');
  showHUD();
  switchTab('buildingsTab');
  updateHUD();
  showBuildings();
  showResearch();
  initMap();
  startBotSimulation();
};

window.switchTab = (tabId) => {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
};
