import { user } from './user.js';
import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

const researchList = [
  { id: 'miningTech', name: 'Tehnologie Minare', requiredLab: 1 },
  { id: 'crystalPhysics', name: 'Fizica Cristalină', requiredLab: 1 },
  { id: 'advancedEnergy', name: 'Energetică Avansată', requiredLab: 2 },
  { id: 'spaceTech', name: 'Tehnologie Spațială', requiredLab: 3 }
];

export function renderResearch() {
  const container = document.getElementById('researchTab');
  container.innerHTML = '<h2>Cercetare</h2><div class="research-cards"></div>';
  const cardContainer = container.querySelector('.research-cards');

  const labLevel = user.buildings['researchLab'] || 0;

  researchList.forEach(tech => {
    const level = user.research[tech.id] || 0;
    const next = level + 1;
    const cost = getResearchCost(next);

    const card = document.createElement('div');
    card.className = 'research-card';
    card.innerHTML = `
      <h3>${tech.name}</h3>
      <p>Nivel: ${level}</p>
      ${labLevel >= tech.requiredLab
        ? `<p>Cost: M:${cost.metal}, C:${cost.crystal}, E:${cost.energy}</p>
           <button onclick="startResearch('${tech.id}')">Cercetează</button>`
        : `<p>Necesită laborator de cercetare Lv ${tech.requiredLab}</p>`
      }
    `;

    cardContainer.appendChild(card);
  });
}

function getResearchCost(level) {
  return {
    metal: 200 * level ** 2,
    crystal: 150 * level ** 2,
    energy: 100 * level ** 2
  };
}

window.startResearch = function (id) {
  const tech = researchList.find(t => t.id === id);
  const level = user.research[id] || 0;
  const next = level + 1;
  const cost = getResearchCost(next);

  if (
    user.resources.metal < cost.metal ||
    user.resources.crystal < cost.crystal ||
    user.resources.energy < cost.energy
  ) return showMessage('Resurse insuficiente.');

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;
  user.research[id] = next;
  user.score += 25 * next;

  updateHUD();
  renderResearch();
  showMessage(`Ai cercetat ${tech.name} la nivelul ${next}!`);
};
