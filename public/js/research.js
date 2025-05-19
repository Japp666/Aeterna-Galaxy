import { user, showMessage, canAfford, deductResources } from './user.js';

const researchList = [
  {
    id: 'miningTech',
    name: 'Tehnologie Minare',
    description: 'Crește producția de metal cu 5% pe nivel.',
    maxLevel: 10,
    baseCost: { metal: 400, crystal: 300, energy: 200 },
    requiredBuilding: 'researchCenter',
    requiredLevel: 1
  },
  {
    id: 'crystalTech',
    name: 'Fizică Cristalină',
    description: 'Crește producția de cristal cu 5% pe nivel.',
    maxLevel: 10,
    baseCost: { metal: 500, crystal: 400, energy: 300 },
    requiredBuilding: 'researchCenter',
    requiredLevel: 1
  },
  {
    id: 'energyTech',
    name: 'Energetică Avansată',
    description: 'Crește producția de energie cu 5% pe nivel.',
    maxLevel: 10,
    baseCost: { metal: 600, crystal: 500, energy: 400 },
    requiredBuilding: 'researchCenter',
    requiredLevel: 5
  },
  {
    id: 'spaceTech',
    name: 'Tehnologie Spațială',
    description: 'Deblochează accesul la flotă.',
    maxLevel: 1,
    baseCost: { metal: 1000, crystal: 1000, energy: 1000 },
    requiredBuilding: 'researchCenter',
    requiredLevel: 10
  }
];

export function showResearch() {
  const container = document.getElementById('research');
  container.innerHTML = '';

  researchList.forEach(research => {
    const level = user.research[research.id] || 0;
    const rcLevel = user.buildings[research.requiredBuilding] || 0;
    const unlocked = rcLevel >= research.requiredLevel;
    const cost = calculateResearchCost(research, level + 1);

    const div = document.createElement('div');
    div.className = `research-card ${!unlocked ? 'locked' : ''}`;
    div.innerHTML = `
      <h3>${research.name}</h3>
      <p>${research.description}</p>
      <p>Nivel: ${level}</p>
      <p>Cost: ${formatCost(cost)}</p>
      <button ${!unlocked ? 'disabled' : ''} onclick="startResearch('${research.id}')">Cercetează</button>
    `;
    container.appendChild(div);
  });
}

window.startResearch = function (id) {
  const research = researchList.find(r => r.id === id);
  const level = user.research[id] || 0;
  const cost = calculateResearchCost(research, level + 1);

  if (!canAfford(cost)) {
    showMessage('Nu ai suficiente resurse.');
    return;
  }

  deductResources(cost);
  user.research[id] = level + 1;
  showResearch();
};

function calculateResearchCost(research, level) {
  const factor = 1.5;
  return {
    metal: Math.floor(research.baseCost.metal * Math.pow(factor, level - 1)),
    crystal: Math.floor(research.baseCost.crystal * Math.pow(factor, level - 1)),
    energy: Math.floor(research.baseCost.energy * Math.pow(factor, level - 1))
  };
}

function formatCost(cost) {
  return `M: ${cost.metal}, C: ${cost.crystal}, E: ${cost.energy}`;
}
