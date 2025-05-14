import { user } from './user.js';
import { updateResources } from './utils.js';

const buildingList = [
  { name: 'Extractor Metal', level: 0, type: 'metal' },
  { name: 'Extractor Cristal', level: 0, type: 'crystal' },
  { name: 'Generator Energie', level: 0, type: 'energy' },
  { name: 'Centrul de Comandă', level: 0, type: 'infrastructure' },
  { name: 'Laborator Cercetare', level: 0, type: 'infrastructure' }
];

function getProduction(building) {
  const level = building.level;
  const base = {
    metal: 30,
    crystal: 20,
    energy: 10
  };

  if (building.name === 'Extractor Metal') {
    return Math.round(base.metal * level * (level < 4 ? 2.5 : 5));
  }
  if (building.name === 'Extractor Cristal') {
    return Math.round(base.crystal * level * (level < 4 ? 2.5 : 5));
  }
  if (building.name === 'Generator Energie') {
    return Math.round(base.energy * level * (level < 4 ? 2.5 : 4));
  }

  return 0;
}

function getUpgradeCost(building) {
  const level = building.level + 1;
  return {
    metal: 100 * level * (building.type === 'metal' ? 1 : 1.5),
    crystal: 80 * level * (building.type === 'crystal' ? 1 : 1.5),
    energy: 60 * level
  };
}

function canUpgrade(cost) {
  return (
    user.resources.metal >= cost.metal &&
    user.resources.crystal >= cost.crystal &&
    user.resources.energy >= cost.energy
  );
}

function renderBuildings() {
  const container = document.getElementById('building-cards');
  if (!container) return;
  container.innerHTML = '';

  buildingList.forEach((building, index) => {
    const cost = getUpgradeCost(building);
    const prod = getProduction(building);
    const canAfford = canUpgrade(cost);

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${building.name}</h3>
      <p>Nivel: ${building.level}</p>
      <p>Producție: ${prod}/min</p>
      <p>Cost: ${Math.round(cost.metal)} metal, ${Math.round(cost.crystal)} cristal, ${Math.round(cost.energy)} energie</p>
      <button ${!canAfford ? 'disabled' : ''} onclick="upgradeBuilding(${index})">Upgrade</button>
    `;

    container.appendChild(card);
  });

  updateRates();
}

function updateRates() {
  let metal = 0, crystal = 0, energy = 0;

  buildingList.forEach(b => {
    const prod = getProduction(b);
    if (b.type === 'metal') metal += prod;
    if (b.type === 'crystal') crystal += prod;
    if (b.type === 'energy') energy += prod;
  });

  document.getElementById('metalRate').textContent = metal;
  document.getElementById('crystalRate').textContent = crystal;
  document.getElementById('energyRate').textContent = energy;
}

function upgradeBuilding(index) {
  const building = buildingList[index];
  const cost = getUpgradeCost(building);

  if (!canUpgrade(cost)) return;

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  building.level += 1;

  renderBuildings();
  updateResources();
}

export { renderBuildings, upgradeBuilding };
