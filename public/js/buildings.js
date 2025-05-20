import { user, showMessage } from './utils.js';
import { updateHUD } from './hud.js';

const buildingData = [
  {
    id: 'metalMine',
    name: 'Extractor Metal',
    description: 'Extrage metal brut pentru construcții.',
    baseProduction: 10,
    maxLevel: 20,
    cost: { metal: 200, crystal: 150, energy: 100 },
    unlock: () => true
  },
  {
    id: 'crystalMine',
    name: 'Extractor Cristal',
    description: 'Extrage cristal valoros pentru tehnologii.',
    baseProduction: 7,
    maxLevel: 20,
    cost: { metal: 300, crystal: 200, energy: 120 },
    unlock: () => true
  },
  {
    id: 'energyPlant',
    name: 'Generator Energie',
    description: 'Produce energie pentru bază.',
    baseProduction: 5,
    maxLevel: 20,
    cost: { metal: 250, crystal: 180, energy: 0 },
    unlock: () => true
  },
  {
    id: 'researchCenter',
    name: 'Centru Cercetare',
    description: 'Permite acces la tehnologii avansate.',
    baseProduction: 0,
    maxLevel: 20,
    cost: { metal: 800, crystal: 600, energy: 400 },
    unlock: () =>
      (user.buildings.metalMine || 0) >= 5 &&
      (user.buildings.crystalMine || 0) >= 5 &&
      (user.buildings.energyPlant || 0) >= 5
  }
];

export function showBuildings() {
  const container = document.getElementById('buildingsTab');
  container.innerHTML = '';

  buildingData.forEach(building => {
    const level = user.buildings[building.id] || 0;
    const isUnlocked = building.unlock();
    const nextCost = calculateCost(building, level + 1);
    const div = document.createElement('div');
    div.className = `building-card ${!isUnlocked ? 'locked' : ''}`;
    div.innerHTML = `
      <h3>${building.name}</h3>
      <p>${building.description}</p>
      <p>Nivel: ${level}</p>
      <p>Cost upgrade: ${formatCost(nextCost)}</p>
      <button ${!isUnlocked ? 'disabled' : ''} data-building-id="${building.id}">Upgrade</button>
      <div class="progress-container"><div class="progress-bar" 
      id="${building.id}-bar"></div><span class="progress-text" id="${building.id}-text"></span></div>
    `;
    container.appendChild(div);
  });

  // Attach event listeners after buttons are added to the DOM
  document.querySelectorAll('#buildingsTab button').forEach(button => {
    button.addEventListener('click', () => {
      const buildingId = button.dataset.buildingId;
      upgradeBuilding(buildingId);
    });
  });
}

function upgradeBuilding(id) {
  const building = buildingData.find(b => b.id === id);
  const level = user.buildings[id] || 0;
  const cost = calculateCost(building, level + 1);

  if (!canAfford(cost)) {
    showMessage('Nu ai suficiente resurse.');
    return;
  }

  deductResources(cost);
  updateHUD();

  const progressBar = document.getElementById(`${id}-bar`);
  const text = document.getElementById(`${id}-text`);
  let seconds = calculateTime(level + 1);
  progressBar.style.width = '0%';
  let elapsed = 0;

  const interval = setInterval(() => {
    elapsed++;
    const percent = Math.min((elapsed / seconds) * 100, 100);
    progressBar.style.width = `${percent}%`;
    text.textContent = `${seconds - elapsed}s`;

    if (elapsed >= seconds) {
      clearInterval(interval);
      user.buildings[id] = level + 1;
      user.score += (level + 1) * 10;
      showBuildings();
      updateHUD();
    }
  }, 1000);
}

export function canAfford(cost) {
  return ['metal', 'crystal', 'energy'].every(
    r => user.resources[r] >= cost[r]
  );
}

export function deductResources(cost) {
  ['metal', 'crystal', 'energy'].forEach(r => {
    user.resources[r] -= cost[r];
  });
}

export function formatCost(cost) {
  return `M: ${cost.metal}, C: ${cost.crystal}, E: ${cost.energy}`;
}

export function calculateCost(building, level) {
  const factor = 1.5;
  return {
    metal: Math.floor(building.cost.metal * Math.pow(factor, level - 1)),
    crystal: Math.floor(building.cost.crystal * Math.pow(factor, level - 1)),
    energy: Math.floor(building.cost.energy * Math.pow(factor, level - 1))
  };
}

export function calculateTime(level) {
  return Math.floor(5 * Math.pow(1.4, level)); // timp exponențial
}
