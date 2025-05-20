import { user, showMessage } from './utils.js';
import { updateHUD, updateProductionRates } from './hud.js';

export const buildingData = {
  resources: [
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
    }
  ],
  technology: [
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
  ]
};

export function showBuildings() {
  const container = document.getElementById('buildingsTab');
  container.innerHTML = '';

  for (const category in buildingData) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'building-category';
    categoryDiv.innerHTML = `<h3>${category.toUpperCase()}</h3>`;

    const buildingListDiv = document.createElement('div');
    buildingListDiv.className = 'building-list';

    buildingData[category].forEach(building => {
      const level = user.buildings[building.id] || 0;
      const isUnlocked = building.unlock();
      const nextCost = calculateCost(building, level + 1);
      const cardDiv = document.createElement('div');
      cardDiv.className = `building-card ${!isUnlocked ? 'locked' : ''}`;
      cardDiv.innerHTML = `
        <h3>${building.name}</h3>
        <p>${building.description}</p>
        <p>Nivel: ${level}</p>
        <p>Cost upgrade: ${formatCost(nextCost)}</p>
        <button ${!isUnlocked || level >= building.maxLevel ? 'disabled' : ''} data-building-id="${building.id}">
            ${level >= building.maxLevel ? 'Max Nivel' : 'Upgrade'}
        </button>
        <div class="progress-container">
          <div class="progress-bar" id="${building.id}-bar"></div>
          <span class="progress-text" id="${building.id}-text"></span>
        </div>
      `;
      if (!isUnlocked) {
        // Aici ar trebui să fie mai specific în funcție de cerințe reale
        cardDiv.setAttribute('data-requirements', 'Nivel 5 Extractor');
      }
      buildingListDiv.appendChild(cardDiv);
    });

    categoryDiv.appendChild(buildingListDiv);
    container.appendChild(categoryDiv);
  }

  document.querySelectorAll('#buildingsTab button').forEach(button => {
    button.addEventListener('click', () => {
      const buildingId = button.dataset.buildingId;
      upgradeBuilding(buildingId);
    });
  });
}

function upgradeBuilding(id) {
  const building = Object.values(buildingData)
    .flat()
    .find(b => b.id === id);
  const level = user.buildings[id] || 0;

  if (level >= building.maxLevel) {
    showMessage(`Clădirea ${building.name} a atins nivelul maxim.`);
    return;
  }

  const cost = calculateCost(building, level + 1);

  if (!canAfford(cost)) {
    showMessage('Nu ai suficiente resurse.');
    return;
  }

  deductResources(cost);
  updateHUD(); // Actualizăm HUD imediat după deducerea resurselor

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
      updateHUD(); // Re-actualizăm HUD la finalizarea construcției
      updateProductionRates(); // Actualizăm ratele de producție după finalizarea construcției
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
