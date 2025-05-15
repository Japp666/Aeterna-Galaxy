import { user } from './user.js';
import { updateResources, showMessage } from './utils.js';

let buildingInProgress = false;

window.buildingList = [
  { name: 'Extractor Metal', level: 0, category: 'Clădiri de bază' },
  { name: 'Extractor Cristal', level: 0, category: 'Clădiri de bază' },
  { name: 'Generator Energie', level: 0, category: 'Clădiri de bază' },
  { name: 'Centrul de Comandă', level: 0, category: 'Infrastructură' },
  { name: 'Laborator Cercetare', level: 0, category: 'Infrastructură' }
];

function getBuildingCost(building) {
  const level = building.level + 1;
  return {
    metal: 100 * level,
    crystal: 80 * level,
    energy: 60 * level
  };
}

function canAfford(cost) {
  return (
    user.resources.metal >= cost.metal &&
    user.resources.crystal >= cost.crystal &&
    user.resources.energy >= cost.energy
  );
}

function renderBuildings() {
  const container = document.getElementById('buildings-section');
  if (!container) return;

  container.innerHTML = '';
  const categories = [...new Set(window.buildingList.map(b => b.category))];

  categories.forEach(category => {
    const section = document.createElement('div');
    section.className = 'building-category';

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category;
    section.appendChild(title);

    const group = window.buildingList.filter(b => b.category === category);
    const cardContainer = document.createElement('div');
    cardContainer.className = 'building-cards';

    group.forEach((building, index) => {
      const cost = getBuildingCost(building);
      const card = document.createElement('div');
      card.className = 'card';

      const canBuild = canAfford(cost);

      card.innerHTML = `
        <h3>${building.name}</h3>
        <p>Nivel: ${building.level}</p>
        <p>Cost: ${cost.metal} metal, ${cost.crystal} cristal, ${cost.energy} energie</p>
        <button ${!canBuild || buildingInProgress ? 'disabled' : ''} onclick="upgradeBuilding(${index})">Upgrade</button>
      `;

      cardContainer.appendChild(card);
    });

    section.appendChild(cardContainer);
    container.appendChild(section);
  });
}

function upgradeBuilding(index) {
  if (buildingInProgress) {
    showMessage("Deja construiești o clădire.");
    return;
  }

  const building = window.buildingList[index];
  const cost = getBuildingCost(building);

  if (!canAfford(cost)) {
    showMessage("Resurse insuficiente.");
    return;
  }

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  buildingInProgress = true;

  const duration = Math.floor(5 * Math.pow(1.3, building.level + 1));
  let seconds = duration;
  const total = duration;

  const card = document.querySelectorAll('.card')[index];
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.innerHTML = `
    <div class="progress-fill" id="build-progress-${index}"></div>
    <span class="progress-time" id="build-time-${index}">${seconds}s</span>
  `;
  card.appendChild(bar);

  const interval = setInterval(() => {
    seconds--;
    const fill = document.getElementById(`build-progress-${index}`);
    const time = document.getElementById(`build-time-${index}`);
    if (fill) fill.style.width = `${(100 * (total - seconds)) / total}%`;
    if (time) time.textContent = `${seconds}s`;

    if (seconds <= 0) {
      clearInterval(interval);
      building.level += 1;
      user.score += 50 * building.level;
      buildingInProgress = false;
      renderBuildings();
      updateResources();
    }
  }, 1000);
}

window.upgradeBuilding = upgradeBuilding;

export { renderBuildings };
