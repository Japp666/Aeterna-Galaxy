import { user } from './user.js';
import { updateResources, showMessage } from './utils.js';

let researchList = [
  { name: 'Tehnologie Minare', level: 0, requiredLab: 1 },
  { name: 'Fizica Cristalină', level: 0, requiredLab: 1 },
  { name: 'Energetică Avansată', level: 0, requiredLab: 2 },
  { name: 'Tehnologie Spațială', level: 0, requiredLab: 3 }
];

function getResearchCost(tech) {
  const level = tech.level + 1;
  return {
    metal: 150 * level,
    crystal: 120 * level,
    energy: 90 * level
  };
}

function canAfford(cost) {
  return (
    user.resources.metal >= cost.metal &&
    user.resources.crystal >= cost.crystal &&
    user.resources.energy >= cost.energy
  );
}

function renderResearch() {
  const container = document.getElementById('research-section');
  container.innerHTML = '<h2>Cercetări disponibile</h2>';

  researchList.forEach((tech, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    const lab = window.buildingList.find(b => b.name === 'Laborator Cercetare');
    if (!lab || lab.level < tech.requiredLab) {
      card.classList.add('locked');
      card.innerHTML = `<h3>${tech.name}</h3><p>Necesar: RC Lv ${tech.requiredLab}</p>`;
    } else {
      const cost = getResearchCost(tech);
      const canBuild = canAfford(cost);
      card.innerHTML = `
        <h3>${tech.name}</h3>
        <p>Nivel: ${tech.level}</p>
        <p>Cost: ${cost.metal} metal, ${cost.crystal} cristal, ${cost.energy} energie</p>
        <button ${!canBuild ? 'disabled' : ''} onclick="startResearch(${index})">Cercetează</button>
      `;
    }

    container.appendChild(card);
  });
}

function startResearch(index) {
  const tech = researchList[index];
  const cost = getResearchCost(tech);
  if (!canAfford(cost)) {
    showMessage("Resurse insuficiente.");
    return;
  }

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;
  tech.level++;
  user.score += 25 * tech.level;
  renderResearch();
  updateResources();
}

window.startResearch = startResearch;
export { renderResearch };
