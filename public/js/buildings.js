import { user } from './user.js';
import { updateHUD } from './hud.js';

export function renderBuildings() {
  const container = document.getElementById('buildingsTab');
  container.innerHTML = '';

  const buildingList = [
    { id: 'metalExtractor', name: 'Extractor Metal', baseProd: 10, unlock: true },
    { id: 'crystalExtractor', name: 'Extractor Cristal', baseProd: 10, unlock: true },
    { id: 'energyGenerator', name: 'Generator Energie', baseProd: 10, unlock: true },
    { id: 'commandCenter', name: 'Centru de Comandă', baseProd: 0, unlock: hasAllExtractorsLv5 },
    { id: 'researchLab', name: 'Laborator Cercetare', baseProd: 0, unlock: hasAllExtractorsLv5 }
  ];

  const active = buildingList.filter(b => b.unlock === true || (typeof b.unlock === 'function' && b.unlock()));
  const inactive = buildingList.filter(b => !(b.unlock === true || (typeof b.unlock === 'function' && b.unlock())));

  container.innerHTML += `<h2 class="category-title">Clădiri Active</h2><div class="building-cards">`;
  active.forEach(building => container.innerHTML += createCard(building, true));
  container.innerHTML += `</div>`;

  container.innerHTML += `<h2 class="category-title">Clădiri Blocate</h2><div class="building-cards">`;
  inactive.forEach(building => container.innerHTML += createCard(building, false));
  container.innerHTML += `</div>`;
}

function hasAllExtractorsLv5() {
  return ['metalExtractor', 'crystalExtractor', 'energyGenerator'].every(b => (user.buildings[b] || 0) >= 5);
}

function createCard(building, active) {
  const level = user.buildings[building.id] || 0;
  const nextLevel = level + 1;
  const cost = getUpgradeCost(nextLevel);
  const duration = getUpgradeTime(nextLevel);

  let html = `
    <div class="card">
      <h3>${building.name}</h3>
      <p>Nivel: ${level}</p>
      ${active ? `
        <p>Cost: M:${cost.metal}, C:${cost.crystal}, E:${cost.energy}</p>
        <p>Durată: ${duration}s</p>
        <button onclick="upgradeBuilding('${building.id}')">Upgrade</button>
        <div id="${building.id}-progress" class="progress-bar">
          <div class="bar" style="width:0%"><span class="bar-text"></span></div>
        </div>
      ` : `<p>Necesar: Toate extractoarele nivel 5</p>`}
    </div>`;
  return html;
}

function getUpgradeCost(level) {
  return {
    metal: 100 * level ** 2,
    crystal: 80 * level ** 2,
    energy: 50 * level ** 2
  };
}

function getUpgradeTime(level) {
  return 5 + level * 2;
}

window.upgradeBuilding = function (id) {
  const level = user.buildings[id] || 0;
  const next = level + 1;
  const cost = getUpgradeCost(next);
  if (
    user.resources.metal < cost.metal ||
    user.resources.crystal < cost.crystal ||
    user.resources.energy < cost.energy
  ) return alert('Resurse insuficiente.');

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;
  updateHUD();

  const duration = getUpgradeTime(next);
  const progressEl = document.getElementById(`${id}-progress`).querySelector('.bar');
  const textEl = progressEl.querySelector('.bar-text');

  let elapsed = 0;
  const interval = setInterval(() => {
    elapsed++;
    const percent = Math.floor((elapsed / duration) * 100);
    progressEl.style.width = `${percent}%`;
    textEl.textContent = `${duration - elapsed}s`;
    if (elapsed >= duration) {
      clearInterval(interval);
      user.buildings[id] = next;
      renderBuildings();
    }
  }, 1000);
};
