import { updateHUD } from './hud.js';
import { showMessage, formatTime } from './utils.js';

const techTree = [
  {
    id: 'miningTech',
    name: 'Tehnologie Minare',
    baseCost: { metal: 300, crystal: 200, energy: 150 },
    baseTime: 30,
    maxLevel: 10,
    effect: 'bonusMetal',
    requirement: 'researchLab'
  },
  {
    id: 'crystalTech',
    name: 'Fizica Cristalină',
    baseCost: { metal: 400, crystal: 300, energy: 200 },
    baseTime: 40,
    maxLevel: 10,
    effect: 'bonusCrystal',
    requirement: 'researchLab'
  },
  {
    id: 'energyTech',
    name: 'Energetică Avansată',
    baseCost: { metal: 600, crystal: 400, energy: 300 },
    baseTime: 50,
    maxLevel: 10,
    effect: 'bonusEnergy',
    requirement: 'researchLab'
  },
  {
    id: 'spaceTech',
    name: 'Tehnologie Spațială',
    baseCost: { metal: 1000, crystal: 800, energy: 500 },
    baseTime: 60,
    maxLevel: 5,
    effect: 'unlockFleet',
    requirement: 'researchLab'
  }
];

export function initResearch() {
  const container = document.getElementById('researchTab');
  container.innerHTML = '';

  techTree.forEach(tech => {
    const level = window.user.research[tech.id] || 0;
    const nextLevel = level + 1;
    const unlocked = (window.user.buildings[tech.requirement] || 0) > 0;

    const cost = Object.entries(tech.baseCost).map(([res, val]) =>
      `${res}: ${val * nextLevel}`).join(', ');

    const div = document.createElement('div');
    div.className = 'research-card';
    if (!unlocked) div.classList.add('locked');

    div.innerHTML = `
      <h3>${tech.name} (Lv. ${level})</h3>
      <p>Cost: ${cost}</p>
      <p>Durată: ${formatTime(tech.baseTime * nextLevel)}</p>
      <div class="progress-container hidden" id="${tech.id}-progress">
        <div class="progress-bar" id="${tech.id}-bar"></div>
        <span class="progress-text" id="${tech.id}-text">0s</span>
      </div>
      <button ${!unlocked ? 'disabled' : ''} onclick="startResearch('${tech.id}')">Cercetează</button>
    `;

    container.appendChild(div);
  });

  window.startResearch = function (id) {
    const tech = techTree.find(t => t.id === id);
    const level = window.user.research[id] || 0;
    const nextLevel = level + 1;
    if (nextLevel > tech.maxLevel) {
      showMessage('Nivel maxim atins!', 'error');
      return;
    }

    let canAfford = true;
    const cost = {};
    for (let res in tech.baseCost) {
      cost[res] = tech.baseCost[res] * nextLevel;
      if (window.user.resources[res] < cost[res]) canAfford = false;
    }

    if (!canAfford) {
      showMessage('Resurse insuficiente!', 'error');
      return;
    }

    const progress = document.getElementById(`${id}-progress`);
    const bar = document.getElementById(`${id}-bar`);
    const text = document.getElementById(`${id}-text`);
    const btn = document.querySelector(`button[onclick="startResearch('${id}')"]`);

    btn.disabled = true;
    progress.classList.remove('hidden');

    let seconds = tech.baseTime * nextLevel;
    const interval = setInterval(() => {
      seconds--;
      bar.style.width = `${((tech.baseTime * nextLevel - seconds) / (tech.baseTime * nextLevel)) * 100}%`;
      text.textContent = `${seconds}s`;

      if (seconds <= 0) {
        clearInterval(interval);
        progress.classList.add('hidden');
        window.user.research[id] = nextLevel;
        showMessage(`${tech.name} a ajuns la nivel ${nextLevel}`, 'success');

        // bonusuri de producție
        if (tech.effect === 'bonusMetal') window.user.bonuses.metal = 0.05 * nextLevel;
        if (tech.effect === 'bonusCrystal') window.user.bonuses.crystal = 0.05 * nextLevel;
        if (tech.effect === 'bonusEnergy') window.user.bonuses.energy = 0.05 * nextLevel;

        initResearch();
        updateHUD();
      }
    }, 1000);

    // scade resursele
    for (let res in cost) {
      window.user.resources[res] -= cost[res];
    }
  };
}
