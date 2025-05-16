import { user } from './user.js';
import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

const buildingData = [
  {
    category: 'Clădiri de Extracție',
    buildings: [
      {
        id: 'metalMine',
        name: 'Extractor Metal',
        description: 'Extrage metal din scoarța planetei.',
        baseCost: { metal: 200, crystal: 150, energy: 100 },
        time: 10,
        maxLevel: 20
      },
      {
        id: 'crystalMine',
        name: 'Extractor Cristal',
        description: 'Extrage cristal pur pentru tehnologii avansate.',
        baseCost: { metal: 180, crystal: 180, energy: 120 },
        time: 12,
        maxLevel: 20
      },
      {
        id: 'energyGenerator',
        name: 'Generator Energie',
        description: 'Produce energie necesară funcționării bazei.',
        baseCost: { metal: 100, crystal: 100, energy: 0 },
        time: 8,
        maxLevel: 20
      }
    ]
  },
  {
    category: 'Clădiri de Suport',
    buildings: [
      {
        id: 'commandCenter',
        name: 'Centrul de Comandă',
        description: 'Coordonează activitatea generală a bazei.',
        baseCost: { metal: 500, crystal: 400, energy: 300 },
        time: 30,
        maxLevel: 15
      },
      {
        id: 'researchCenter',
        name: 'Laborator Cercetare',
        description: 'Permite dezvoltarea de tehnologii.',
        baseCost: { metal: 500, crystal: 400, energy: 300 },
        time: 40,
        maxLevel: 20,
        unlockCondition: () => (
          (user.buildings?.metalMine || 0) >= 5 &&
          (user.buildings?.crystalMine || 0) >= 5 &&
          (user.buildings?.energyGenerator || 0) >= 5
        )
      }
    ]
  },
  {
    category: 'Infrastructură Flotă',
    buildings: [
      {
        id: 'shipyard',
        name: 'Șantier Naval',
        description: 'Permite construcția de nave.',
        baseCost: { metal: 800, crystal: 600, energy: 400 },
        time: 60,
        maxLevel: 20,
        unlockCondition: () => (user.buildings?.researchCenter || 0) >= 2
      }
    ]
  }
];

function calculateCost(baseCost, level) {
  const multiplier = 1.6 ** (level - 1);
  return {
    metal: Math.round(baseCost.metal * multiplier),
    crystal: Math.round(baseCost.crystal * multiplier),
    energy: Math.round(baseCost.energy * multiplier)
  };
}

function buildBuildingCard(building, level = 0) {
  const isUnlocked = !building.unlockCondition || building.unlockCondition();
  const requirementsText = building.unlockCondition ? 'Nivel 5 la toate minele' : '';
  const cost = calculateCost(building.baseCost, level + 1);

  const card = document.createElement('div');
  card.className = 'building-card';
  if (!isUnlocked) {
    card.classList.add('locked');
    card.setAttribute('data-requirements', requirementsText);
  }

  card.innerHTML = `
    <h4>${building.name}</h4>
    <p>${building.description}</p>
    <p>Nivel: ${level}</p>
    <p>Cost: <br>🪙 ${cost.metal} | 💎 ${cost.crystal} | ⚡ ${cost.energy}</p>
    ${isUnlocked ? `<button onclick="upgradeBuilding('${building.id}')">Upgrade</button>` : ''}
    <div class="progress-bar" id="bar-${building.id}" style="display:none;">
      <div class="progress-bar-fill" id="fill-${building.id}"></div>
      <div class="progress-timer" id="timer-${building.id}">0s</div>
    </div>
  `;
  return card;
}

export function renderBuildings() {
  const container = document.getElementById('buildingsTab');
  container.innerHTML = '';

  if (!user.buildings) user.buildings = {};

  buildingData.forEach(section => {
    const catDiv = document.createElement('div');
    catDiv.className = 'building-category';
    catDiv.innerHTML = `<h3>${section.category}</h3>`;

    const list = document.createElement('div');
    list.className = 'building-list';

    section.buildings.forEach(building => {
      const level = user.buildings[building.id] || 0;
      list.appendChild(buildBuildingCard(building, level));
    });

    catDiv.appendChild(list);
    container.appendChild(catDiv);
  });
}

window.upgradeBuilding = function (buildingId) {
  const building = buildingData.flatMap(c => c.buildings).find(b => b.id === buildingId);
  if (!building) return;

  const level = user.buildings[buildingId] || 0;
  if (level >= building.maxLevel) {
    showMessage('Nivel maxim atins.');
    return;
  }

  const cost = calculateCost(building.baseCost, level + 1);
  if (
    user.resources.metal < cost.metal ||
    user.resources.crystal < cost.crystal ||
    user.resources.energy < cost.energy
  ) {
    showMessage('Resurse insuficiente.');
    return;
  }

  // Scade resursele
  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;
  updateHUD();

  const bar = document.getElementById(`bar-${buildingId}`);
  const fill = document.getElementById(`fill-${buildingId}`);
  const timer = document.getElementById(`timer-${buildingId}`);
  if (!bar || !fill || !timer) return;

  bar.style.display = 'block';
  let remaining = building.time + level * 2;
  const total = remaining;
  const interval = setInterval(() => {
    remaining--;
    const percent = ((total - remaining) / total) * 100;
    fill.style.width = `${percent}%`;
    timer.textContent = `${remaining}s`;

    if (remaining <= 0) {
      clearInterval(interval);
      user.buildings[buildingId] = level + 1;
      renderBuildings();
      updateHUD();
      showMessage(`${building.name} a fost upgradat la nivel ${level + 1}`);
    }
  }, 1000);
};
