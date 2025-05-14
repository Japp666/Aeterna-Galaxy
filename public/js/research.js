import { user } from './user.js';
import { updateResources } from './utils.js';

const researchList = [
  { name: 'Tehnologie Minare', level: 0, bonus: 'metal' },
  { name: 'Fizică Cristalină', level: 0, bonus: 'crystal' },
  { name: 'Energetică Avansată', level: 0, bonus: 'energy' }
];

function getResearchBonus(research) {
  const level = research.level;
  return level * 5; // fiecare nivel oferă +5% producție
}

function getResearchCost(research) {
  const level = research.level + 1;
  return {
    metal: 200 * level,
    crystal: 300 * level,
    energy: 250 * level
  };
}

function canResearch(cost) {
  return (
    user.resources.metal >= cost.metal &&
    user.resources.crystal >= cost.crystal &&
    user.resources.energy >= cost.energy
  );
}

function renderResearch() {
  const container = document.getElementById('research-cards');
  if (!container) return;
  container.innerHTML = '';

  researchList.forEach((research, index) => {
    const cost = getResearchCost(research);
    const bonus = getResearchBonus(research);
    const canAfford = canResearch(cost);

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${research.name}</h3>
      <p>Nivel: ${research.level}</p>
      <p>Bonus: +${bonus}% producție ${research.bonus}</p>
      <p>Cost: ${Math.round(cost.metal)} metal, ${Math.round(cost.crystal)} cristal, ${Math.round(cost.energy)} energie</p>
      <button ${!canAfford ? 'disabled' : ''} onclick="doResearch(${index})">Cercetează</button>
    `;

    container.appendChild(card);
  });
}

function doResearch(index) {
  const research = researchList[index];
  const cost = getResearchCost(research);

  if (!canResearch(cost)) return;

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  research.level += 1;

  // aplicăm bonusul direct asupra producției
  user.score += 10 * research.level;

  renderResearch();
  updateResources();
}

export { renderResearch, doResearch };
