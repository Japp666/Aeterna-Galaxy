import { user } from './user.js';
import { renderBuildings, upgradeBuilding } from './buildings.js';
import { renderResearch, doResearch } from './research.js';
import { generateMap } from './map.js';
import { updateResources } from './utils.js';

async function loadComponent(file, targetId) {
  const res = await fetch(`components/${file}`);
  const html = await res.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  document.getElementById(targetId).appendChild(div);
}

async function loadUI() {
  await loadComponent('login.html', 'login-container');
  await loadComponent('race-select.html', 'race-container');
  await loadComponent('hud.html', 'game-container');
  await loadComponent('menu.html', 'game-container');
  await loadComponent('tab-buildings.html', 'game-container');
  await loadComponent('tab-research.html', 'game-container');
  await loadComponent('tab-map.html', 'game-container');
  await loadComponent('tab-fleet.html', 'game-container');
  await loadComponent('tab-shipyard.html', 'game-container');

  setupGame();
}

loadUI();

window.startGame = () => {
  const name = document.getElementById('username').value.trim();
  if (name.length < 3) return alert("Introdu un nume valid");
  user.name = name;

  document.getElementById('login-container').classList.add('hidden');
  document.getElementById('race-container').classList.remove('hidden');
};

window.selectRace = (race) => {
  user.race = race;

  document.getElementById('race-container').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');

  initUI();
};

window.switchTab = (id) => {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
};

function setupGame() {
  initUI();

  setInterval(() => {
    const metalRate = parseInt(document.getElementById('metalRate')?.textContent || 0);
    const crystalRate = parseInt(document.getElementById('crystalRate')?.textContent || 0);
    const energyRate = parseInt(document.getElementById('energyRate')?.textContent || 0);

    user.resources.metal += metalRate / 60;
    user.resources.crystal += crystalRate / 60;
    user.resources.energy += energyRate / 60;

    updateResources();

    // ✅ nu rerandează clădirile dacă există construcție activă
    if (!window.buildingInProgress) {
      renderBuildings();
    }
  }, 1000);
}

function initUI() {
  updateResources();
  renderBuildings();
  renderResearch();
  generateMap();
}

window.upgradeBuilding = upgradeBuilding;
window.doResearch = doResearch;
