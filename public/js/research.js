import { user } from './user.js';
import { updateResources } from './utils.js';

const researchList = [
  {
    name: 'Tehnologie Minare',
    level: 0,
    bonus: 'metal',
    available: true,
    category: 'Producție'
  },
  {
    name: 'Fizică Cristalină',
    level: 0,
    bonus: 'crystal',
    available: true,
    category: 'Producție'
  },
  {
    name: 'Energetică Avansată',
    level: 0,
    bonus: 'energy',
    available: false,
    unlockCondition: 'Centrul de Comandă nivel 2',
    category: 'Energie'
  },
  {
    name: 'Tehnologie Spațială',
    level: 0,
    bonus: 'score',
    available: false,
    unlockCondition: 'Laborator Cercetare nivel 2',
    category: 'Avansat'
  }
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

  // Deblocare logică:
  const command = getBuildingLevel('Centrul de Comandă');
  const lab = getBuildingLevel('Laborator Cercetare');

  researchList.forEach(r => {
    if (r.name === 'Energetică Avansată' && command >= 2) r.available = true;
    if (r.name === 'Tehnologie Spațială' && lab >= 2) r.available = true;
  });

  const categories = [...new Set(researchList.map(r => r.category))];

  categories.forEach(category => {
    const section = document.createElement('div');
    section.className = 'research-category';

    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = category;
    section.appendChild(title);

    const group = researchList.filter(r => r.category === category);
    group.forEach((research, index) => {
      const cost = getResearchCost(research);
      const bonus = getResearchBonus(research);
      const canAfford = canResearch(cost);

      const card = document.createElement('div');
      card.className = 'card';
      if (!research.available) card.classList.add('locked');

      card.innerHTML = `
        <h3>${research.name}</h3>
        <p>Nivel: ${research.level}</p>
        ${research.available ? `
          <p>Bonus: +${bonus}% ${research.bonus === 'score' ? 'puncte' : 'producție ' + research.bonus}</p>
          <p>Cost: ${cost.metal} metal, ${cost.crystal} cristal, ${cost.energy} energie</p>
          <button ${!canAfford ? 'disabled' : ''} onclick="doResearch(${index})">Cercetează</button>
        ` : `
          <p><em>Blocată: ${research.unlockCondition}</em></p>
        `}
      `;

      section.appendChild(card);
    });

    container.appendChild(section);
  });
}

function getBuildingLevel(name) {
  const building = window.buildingList?.find(b => b.name === name);
  return building?.level || 0;
}

function doResearch(index) {
  const research = researchList[index];
  const cost = getResearchCost(research);

  if (!canResearch(cost)) return;

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  research.level += 1;

  if (research.bonus === 'score') {
    user.score += 50 * research.level;
  }

  renderResearch();
  updateResources();
}

export { renderResearch, doResearch };
