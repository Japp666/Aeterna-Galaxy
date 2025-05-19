import { updateHUD } from './hud.js';
import { formatTime, showMessage } from './utils.js';

const buildingData = [
  {
    id: 'metalMine',
    name: 'Extractor Metal',
    baseCost: { metal: 200, crystal: 150, energy: 100 },
    baseTime: 30,
    production: { metal: 20 },
    maxLevel: 20
  },
  {
    id: 'crystalMine',
    name: 'Extractor Cristal',
    baseCost: { metal: 300, crystal: 200, energy: 150 },
    baseTime: 30,
    production: { crystal: 15 },
    maxLevel: 20
  },
  {
    id: 'powerPlant',
    name: 'Generator Energie',
    baseCost: { metal: 250, crystal: 100, energy: 0 },
    baseTime: 30,
    production: { energy: 30 },
    maxLevel: 20
  },
  {
    id: 'commandCenter',
    name: 'Centrul de Comandă',
    baseCost: { metal: 1000, crystal: 800, energy: 500 },
    baseTime: 60,
    bonus: 'reduceTime',
    maxLevel: 20,
    unlocked: false,
    unlockRequirement: {
      building: ['metalMine', 'crystalMine', 'powerPlant'],
      level: 5
    }
  },
  {
    id: 'researchLab',
    name: 'Laborator Cercetare',
    baseCost: { metal: 1200, crystal: 1000, energy: 800 },
    baseTime: 60,
    unlockRequirement: {
      building: ['metalMine', 'crystalMine', 'powerPlant'],
      level: 5
    },
    maxLevel: 20
  }
];

export function initBuildings() {
  const container = document.getElementById('buildingsTab');
  container.innerHTML = '';

  buildingData.forEach(data => {
    const level = window.user.buildings[data.id] || 0;
    const nextLevel = level + 1;

    // Unlock logic
    let unlocked = true;
    if (data.unlockRequirement) {
      unlocked = data.unlockRequirement.building.every(b => {
        const currentLevel = window.user.buildings[b] || 0;
        return currentLevel >= data.unlockRequirement.level;
      });
    }

    const div = document.createElement('div');
    div.className = 'building-card';
    if (!unlocked) div.classList.add('locked');

    const cost = Object.entries(data.baseCost).map(([key, val]) =>
      `${key}: ${val * nextLevel}`
    ).join(', ');

    div.innerHTML = `
      <h3>${data.name} (Lv. ${level})</h3>
      <p>Cost: ${cost}</p>
      <p>Timp: ${formatTime(data.baseTime * nextLevel)}</p>
      <div class="progress-container hidden" id="${data.id}-progress">
        <div class="progress-bar" id="${data.id}-bar"></div>
        <span class="progress-text" id="${data.id}-text">0s</span>
      </div>
      <button ${!unlocked ? 'disabled' : ''} onclick="upgradeBuilding('${data.id}')">Upgrade</button>
    `;

    container.appendChild(div);
  });

  // Resetează producția
  setInterval(() => {
    const u = window.user;
    u.production = { metal: 0, crystal: 0, energy: 0 };
    buildingData.forEach(b => {
      const level = u.buildings[b.id] || 0;
      if (b.production) {
        Object.entries(b.production).forEach(([res, value]) => {
          u.production[res] += value * level;
        });
      }
    });
    Object.entries(u.production).forEach(([res, rate]) => {
      u.resources[res] += rate / 60;
    });
    updateHUD();
  }, 1000);

  window.upgradeBuilding = function (id) {
    const building = buildingData.find(b => b.id === id);
    const level = window.user.buildings[id] || 0;
    const nextLevel = level + 1;

    if (nextLevel > building.maxLevel) {
      showMessage('Nivel maxim atins!', 'error');
      return;
    }

    const cost = {};
    let canAfford = true;
    for (const res in building.baseCost) {
      cost[res] = building.baseCost[res] * nextLevel;
      if (window.user.resources[res] < cost[res]) {
        canAfford = false;
      }
    }

    if (!canAfford) {
      showMessage('Resurse insuficiente!', 'error');
      return;
    }

    const time = building.baseTime * nextLevel;
    const btn = document.querySelector(`button[onclick="upgradeBuilding('${id}')"]`);
    const progressBar = document.getElementById(`${id}-bar`);
    const progressContainer = document.getElementById(`${id}-progress`);
    const progressText = document.getElementById(`${id}-text`);

    btn.disabled = true;
    progressContainer.classList.remove('hidden');

    let seconds = time;
    const interval = setInterval(() => {
      seconds--;
      const percent = ((time - seconds) / time) * 100;
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${seconds}s`;

      if (seconds <= 0) {
        clearInterval(interval);
        window.user.buildings[id] = nextLevel;
        progressContainer.classList.add('hidden');
        showMessage(`${building.name} a fost îmbunătățit la nivel ${nextLevel}`, 'success');
        initBuildings();
        updateHUD();
      }
    }, 1000);

    // Scade resursele
    for (const res in cost) {
      window.user.resources[res] -= cost[res];
    }
  };
}
