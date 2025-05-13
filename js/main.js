// main.js

import { user } from './user.js';
import { renderBuildings, upgradeBuilding } from './buildings.js';
import { renderResearch, doResearch } from './research.js';
import { generateMap } from './map.js';
import { updateResources } from './utils.js';

// === AUTENTIFICARE ===
window.startGame = () => {
  const name = document.getElementById('username').value.trim();
  if (name.length < 3) return alert("Introdu un nume valid");
  user.name = name;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('race-screen').classList.remove('hidden');
};

window.selectRace = (race) => {
  user.race = race;
  document.getElementById('race-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  initUI();
};

// === INIȚIALIZARE INTERFAȚĂ ===
function initUI() {
  updateResources();
  renderBuildings();
  renderResearch();
  generateMap();
}

// === TABURI ===
window.switchTab = (id) => {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
};

// === PRODUCȚIE AUTOMATĂ ===
setInterval(() => {
  const prodPerSecond = {
    metal: 0,
    crystal: 0,
    energy: 0
  };

  const metalMine = document.getElementById('metalRate');
  const crystalMine = document.getElementById('crystalRate');
  const powerPlant = document.getElementById('energyRate');

  if (metalMine) prodPerSecond.metal = parseInt(metalMine.textContent) / 60;
  if (crystalMine) prodPerSecond.crystal = parseInt(crystalMine.textContent) / 60;
  if (powerPlant) prodPerSecond.energy = parseInt(powerPlant.textContent) / 60;

  user.resources.metal += prodPerSecond.metal;
  user.resources.crystal += prodPerSecond.crystal;
  user.resources.energy += prodPerSecond.energy;

  updateResources();
  renderBuildings();
}, 1000);

// === EXPUNERE FUNCȚII PENTRU BUTOANE ===
window.upgradeBuilding = upgradeBuilding;
window.doResearch = doResearch;
