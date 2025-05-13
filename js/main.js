// main.js

import { user } from './user.js';
import { renderBuildings, upgradeBuilding } from './buildings.js';
import { renderResearch, doResearch } from './research.js';
import { generateMap } from './map.js';
import { updateResources } from './utils.js';

// === Încarcă componentele HTML din folderul /components ===
async function loadComponent(file, targetId = 'app') {
  const res = await fetch(`components/${file}`);
  const html = await res.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  document.getElementById(targetId).appendChild(div);
}

async function loadUI() {
  await loadComponent('login.html');
  await loadComponent('race-select.html');
  await loadComponent('hud.html');
  await loadComponent('menu.html');
  await loadComponent('tab-buildings.html');
  await loadComponent('tab-research.html');
  await loadComponent('tab-map.html');
  await loadComponent('tab-fleet.html');
  await loadComponent('tab-shipyard.html');

  // După încărcarea UI-ului, pornește jocul
  setupGame();
}

loadUI();

// === Funcții globale accesibile din butoane HTML ===
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
  document.getElementById('game-screen')?.classList.remove('hidden');

  // dacă nu avem div cu id game-screen, nu-l afișăm
  initUI();
};

window.switchTab = (id) => {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
};

function setupGame() {
  // asigură containerul principal dacă nu există
  if (!document.getElementById('game-screen')) {
    const div = document.createElement('div');
    div.id = 'game-screen';
    document.body.appendChild(div);
  }

  initUI();

  // Producție pasivă la fiecare secundă
  setInterval(() => {
    const prodPerSecond = {
      metal: 0,
      crystal: 0,
      energy: 0
    };

    const metalRate = parseInt(document.getElementById('metalRate')?.textContent || 0);
    const crystalRate = parseInt(document.getElementById('crystalRate')?.textContent || 0);
    const energyRate = parseInt(document.getElementById('energyRate')?.textContent || 0);

    prodPerSecond.metal = metalRate / 60;
    prodPerSecond.crystal = crystalRate / 60;
    prodPerSecond.energy = energyRate / 60;

    user.resources.metal += prodPerSecond.metal;
    user.resources.crystal += prodPerSecond.crystal;
    user.resources.energy += prodPerSecond.energy;

    updateResources();
    renderBuildings();
  }, 1000);
}

function initUI() {
  updateResources();
  renderBuildings();
  renderResearch();
  generateMap();
}

// Expunem funcții către HTML
window.upgradeBuilding = upgradeBuilding;
window.doResearch = doResearch;
