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

let researchInProgress = false;

function getResearchBonus(research) {
  const level = research.level;
  return level * 5; // fiecare nivel oferă +5%
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

  // deblocare în funcție de clădiri
