import { user } from './user.js';
import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

const techTree = [
  {
    category: 'Cercetări Economice',
    technologies: [
      {
        id: 'miningTech',
        name: 'Tehnologie Minare',
        description: 'Crește producția de metal cu 5% pe nivel.',
        baseCost: { metal: 300, crystal: 200, energy: 100 },
        time: 10,
        maxLevel: 10,
        applyEffect: (level) => {
          user.bonuses.metal = level * 0.05;
        }
      },
      {
        id: 'crystalPhysics',
        name: 'Fizica Cristalină',
        description: 'Crește producția de cristal cu 5% pe nivel.',
        baseCost: { metal: 250, crystal: 300, energy: 100 },
        time: 12,
        maxLevel: 10,
        applyEffect: (level) => {
          user.bonuses.crystal = level * 0.05;
        }
      }
    ]
  },
  {
    category: 'Cercetări Defensive',
    technologies: [
      {
        id: 'smallWeaponDefense',
        name: 'Small Weapon Defense',
        description: 'Deblochează apărare ușoară, +5% damage/tură.',
        baseCost: { metal: 500, crystal: 400, energy: 300 },
        time: 20,
        maxLevel: 10,
        unlockRC: 1
      },
      {
        id: 'mediumWeaponDefense',
        name: 'Medium Weapon Defense',
        description: 'Deblochează apărare medie, +7% damage/tură.',
        baseCost: { metal: 2000, crystal: 1600, energy: 1200 },
        time: 30,
        maxLevel: 10,
        unlockRC: 5
      },
      {
        id: 'largeWeaponDefense',
        name: 'Large Weapon Defense',
        description: 'Deblochează apărare grea, +10% damage/tură.',
        baseCost: { metal: 5000, crystal: 4000, energy: 3000 },
        time: 60,
        maxLevel: 10,
        unlockRC: 10
      }
    ]
  },
  {
    category: 'Propulsie Nave',
    technologies: [
      {
        id: 'smallShipPropulsion',
        name: 'Propulsie Nave Mici',
        description: '+5% viteză pentru nave mici per nivel.',
        baseCost: { metal: 400, crystal: 300, energy: 200 },
        time: 10,
        maxLevel: 10,
        unlockRC: 1
      },
      {
        id: 'mediumShipPropulsion',
        name: 'Propulsie Nave Medii',
        description: '+5% viteză pentru nave medii per nivel.',
        baseCost: { metal: 800, crystal: 600, energy: 400 },
        time: 15,
        maxLevel: 10,
        unlockRC: 5
      },
      {
        id: 'largeShipPropulsion',
        name: 'Propulsie Nave Mari',
        description: '+5% viteză pentru nave mari per nivel.',
        baseCost: { metal: 1200, crystal: 900, energy: 600 },
        time: 20,
        maxLevel: 10,
        unlockRC: 10
      }
    ]
  }
];

function calculateCost(base, level) {
  const factor = 1.5 ** (level - 1);
  return {
    metal: Math.round(base.metal * factor),
    crystal: Math.round(base.crystal * factor),
    energy: Math.round(base.energy * factor)
  };
}

function buildResearchCard(tech, level = 0) {
  const rcLevel = user.buildings?.researchCenter || 0;
  const isUnlocked = !tech.unlockRC || rcLevel >= tech.unlockRC;

  const cost = calculateCost(tech.baseCost, level + 1);

  const card = document.createElement('div');
  card.className = 'building-card';
  if (!isUnlocked) {
    card.classList.add('locked');
    card.setAttribute('data-requirements', `RC Lv${tech.unlockRC}`);
  }

  card.innerHTML = `
    <h4>${tech.name}</h4>
    <p>${tech.description}</p>
    <p>Nivel: ${level}</p>
    <p>Cost: 🪙 ${cost.metal} | 💎 ${cost.crystal} | ⚡ ${cost.energy}</p>
    ${isUnlocked ? `<button onclick="researchTech('${tech.id}')">Cercetează</button>` : ''}
    <div class="progress-bar" id="bar-${tech.id}" style="display:none;">
      <div class="progress-bar-fill" id="fill-${tech.id}"></div>
      <div class="progress-timer" id="timer-${tech.id}">0s</div>
    </div>
  `;
  return card;
}

export function renderResearch() {
  const container = document.getElementById('researchTab');
  if (!container) return;

  container.innerHTML = '';

  if (!user.research) user.research = {};
  if (!user.bonuses) user.bonuses = {};

  techTree.forEach(branch => {
    const section = document.createElement('div');
    section.className = 'building-category';
    section.innerHTML = `<h3>${branch.category}</h3>`;

    const list = document.createElement('div');
    list.className = 'building-list';

    branch.technologies.forEach(tech => {
      const level = user.research[tech.id] || 0;
      if (tech.applyEffect) tech.applyEffect(level); // reaplică efectul
      list.appendChild(buildResearchCard(tech, level));
    });

    section.appendChild(list);
    container.appendChild(section);
  });
}

window.researchTech = function (techId) {
  const tech = techTree.flatMap(c => c.technologies).find(t => t.id === techId);
  if (!tech) return;

  const level = user.research[techId] || 0;
  if (level >= tech.maxLevel) {
    showMessage('Nivel maxim atins.');
    return;
  }

  const cost = calculateCost(tech.baseCost, level + 1);
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

  const bar = document.getElementById(`bar-${techId}`);
  const fill = document.getElementById(`fill-${techId}`);
  const timer = document.getElementById(`timer-${techId}`);
  if (!bar || !fill || !timer) return;

  bar.style.display = 'block';
  let remaining = tech.time + level * 2;
  const total = remaining;

  const interval = setInterval(() => {
    remaining--;
    const percent = ((total - remaining) / total) * 100;
    fill.style.width = `${percent}%`;
    timer.textContent = `${remaining}s`;

    if (remaining <= 0) {
      clearInterval(interval);
      user.research[techId] = level + 1;
      if (tech.applyEffect) tech.applyEffect(level + 1);
      renderResearch();
      updateHUD();
      showMessage(`${tech.name} cercetată la nivel ${level + 1}`);
    }
  }, 1000);
};
