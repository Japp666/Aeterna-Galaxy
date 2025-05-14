import { user } from './user.js';
import { updateResources } from './utils.js';
import { checkTutorial } from './tutorial.js';

const buildingList = [
  { name: 'Extractor Metal', level: 0, type: 'metal', available: true, category: 'Producție' },
  { name: 'Extractor Cristal', level: 0, type: 'crystal', available: true, category: 'Producție' },
  { name: 'Generator Energie', level: 0, type: 'energy', available: true, category: 'Producție' },
  { name: 'Centrul de Comandă', level: 0, type: 'infrastructure', available: false, category: 'Infrastructură', unlockCondition: 'Toți extractorii la nivel 3' },
  { name: 'Laborator Cercetare', level: 0, type: 'infrastructure', available: false, category: 'Infrastructură', unlockCondition: 'Centrul de Comandă la nivel 1' }
];

window.buildingList = buildingList;
window.buildingInProgress = false;

function getProduction(building) {
  const level = building.level;
  const base = { metal: 30, crystal: 20, energy: 10 };

  if (building.name === 'Extractor Metal') return Math.round(base.metal * level * (level < 4 ? 2.5 : 5));
  if (building.name === 'Extractor Cristal') return Math.round(base.crystal * level * (level < 4 ? 2.5 : 5));
  if (building.name === 'Generator Energie') return Math.round(base.energy * level * (level < 4 ? 2.5 : 4));

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

  const metal = buildingList.find(b => b.name === 'Extractor Metal');
  const crystal = buildingList.find(b => b.name === 'Extractor Cristal');
  const energy = buildingList.find(b => b.name === 'Generator Energie');
  const command = buildingList.find(b => b.name === 'Centrul de Comandă');
  const lab = buildingList.find(b => b.name === 'Laborator Cercetare');

  if (metal.level >= 3 && crystal.level >= 3 && energy.level >= 3) command.available = true;
  if (command.level >= 1) lab.available = true;

  const categories = [...new Set(buildingList.map(b => b.category))];

  categories.forEach(category => {
    const section = document.createElement('div');
    section.className = 'building-category';

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category;
    section.appendChild(title);

    const group = buildingList.filter(b => b.category === category);
    group.forEach((building, index) => {
      const cost = getUpgradeCost(building);
      const prod = getProduction(building);
      const canAfford = canUpgrade(cost);

      const card = document.createElement('div');
      card.className = 'card';
      if (!building.available) card.classList.add('locked');

      card.innerHTML = `
        <h3>${building.name}</h3>
        <p>Nivel: ${building.level}</p>
        ${building.available ? `
          ${prod > 0 ? `<p>Producție: ${prod}/min</p>` : ''}
          <p>Cost: ${Math.round(cost.metal)} metal, ${Math.round(cost.crystal)} cristal, ${Math.round(cost.energy)} energie</p>
          <button ${!canAfford || window.buildingInProgress ? 'disabled' : ''} onclick="upgradeBuilding(${buildingList.indexOf(building)})">Upgrade</button>
        ` : `
          <p><em>Blocată: ${building.unlockCondition}</em></p>
        `}
      `;

      section.appendChild(card);
    });

    container.appendChild(section);
  });

  updateRates();
  checkTutorial(buildingList);
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
  if (window.buildingInProgress) return alert("O altă construcție este deja în desfășurare!");

  const building = buildingList[index];
  const cost = getUpgradeCost(building);

  if (!canUpgrade(cost)) return;

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  window.buildingInProgress = true;

  const container = document.getElementById('building-cards');
  const card = container.querySelectorAll('.card')[index];
  card.innerHTML += `
    <div class="progress-bar">
      <div class="progress-fill" id="progress-${index}"></div>
      <span class="progress-time" id="progress-time-${index}">...</span>
    </div>
  `;

  let seconds = Math.floor(5 * Math.pow(1.3, building.level + 1));
  const total = seconds;

  const interval = setInterval(() => {
    seconds--;
    const fill = document.getElementById(`progress-${index}`);
    const time = document.getElementById(`progress-time-${index}`);
    if (fill) fill.style.width = `${(100 * (total - seconds)) / total}%`;
    if (time) time.textContent = `${seconds}s`;

    if (seconds <= 0) {
      clearInterval(interval);
      building.level += 1;
      window.buildingInProgress = false;
      renderBuildings();
      updateResources();
    }
  }, 1000);
}

export { renderBuildings, upgradeBuilding };
