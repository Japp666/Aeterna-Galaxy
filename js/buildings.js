// buildings.js

import { user, getBuildingStatus, setBuildingStatus } from './user.js';
import { updateResources, getProd, getCost, areMinesAtLevel5 } from './utils.js';

export const buildings = [
  {
    id: 'metalMine',
    name: 'Extractor Metal',
    level: 0,
    max: 20,
    baseCost: { metal: 100, crystal: 50, energy: 20 },
    production: 20
  },
  {
    id: 'crystalMine',
    name: 'Extractor Cristal',
    level: 0,
    max: 20,
    baseCost: { metal: 80, crystal: 100, energy: 30 },
    production: 15
  },
  {
    id: 'powerPlant',
    name: 'Centrală Energetică',
    level: 0,
    max: 20,
    baseCost: { metal: 60, crystal: 60, energy: 0 },
    production: 10
  },
  {
    id: 'researchLab',
    name: 'Laborator de Cercetare',
    level: 0,
    max: 10,
    baseCost: { metal: 500, crystal: 400, energy: 200 },
    production: 0
  }
];

export function renderBuildings() {
  const container = document.getElementById('building-cards');
  container.innerHTML = '';

  buildings.forEach(building => {
    if (building.id === 'researchLab' && !areMinesAtLevel5()) return;

    const cost = getCost(building);
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <h3>${building.name}</h3>
      <p>Nivel: ${building.level} / ${building.max}</p>
      <p>Producție: ${getProd(building.id)}/min</p>
      <p>Cost:<br>Metal: ${cost.metal}, Cristal: ${cost.crystal}, Energie: ${cost.energy}</p>
    `;

    if (building.building) {
      const elapsed = Date.now() - building.building.startedAt;
      const percent = Math.min((elapsed / building.building.duration) * 100, 100);
      const remaining = Math.ceil((building.building.duration - elapsed) / 1000);

      div.innerHTML += `
        <div class="progress-container">
          <div class="progress-bar" style="width: ${percent}%"></div>
          <div class="progress-timer">${remaining}s</div>
        </div>
      `;

      if (elapsed >= building.building.duration) {
        building.level++;
        user.score += 10;
        delete building.building;
        setBuildingStatus(false);
        updateResources();
      }
    } else {
      div.innerHTML += `<button onclick="upgradeBuilding('${building.id}')">Upgrade</button>`;
    }

    container.appendChild(div);
  });
}

export function upgradeBuilding(id) {
  const b = buildings.find(x => x.id === id);
  if (!b || b.level >= b.max || b.building) return;

  if (getBuildingStatus()) {
    alert("O clădire este deja în construcție.");
    return;
  }

  const cost = getCost(b);
  const duration = 10000 + b.level * 2000;

  if (
    user.resources.metal < cost.metal ||
    user.resources.crystal < cost.crystal ||
    user.resources.energy < cost.energy
  ) {
    return alert("Resurse insuficiente!");
  }

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  b.building = {
    startedAt: Date.now(),
    duration: duration
  };

  setBuildingStatus(true);
  updateResources();
  renderBuildings();
}

