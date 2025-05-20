import { user } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';
import { calculateCost, canAfford, deductResources, formatCost, calculateTime } from './buildings.js';

const researchData = [
  {
    id: 'laserTech',
    name: 'Tehnologie Laser',
    description: 'Îmbunătățește armele laser ale flotei.',
    cost: { metal: 400, crystal: 300, energy: 200 },
    duration: 30,
    effect: () => {
      // user.fleet.small *= 1.1; // Exemplu de efect: creștere atac nave mici cu 10%
      // Aici ar trebui să modifici atributele de atac ale navelor, nu numărul lor
      showMessage('Tehnologie Laser cercetată!');
    },
    unlock: () => (user.buildings.researchCenter || 0) >= 1
  },
  {
    id: 'shieldTech',
    name: 'Tehnologie Scuturi',
    description: 'Îmbunătățește scuturile defensive ale flotei.',
    cost: { metal: 500, crystal: 400, energy: 250 },
    duration: 45,
    effect: () => {
      // user.fleet.medium *= 1.15; // Exemplu de efect: creștere apărare nave medii cu 15%
      // Aici ar trebui să modifici atributele de apărare ale navelor
      showMessage('Tehnologie Scuturi cercetată!');
    },
    unlock: () => (user.buildings.researchCenter || 0) >= 2
  },
  {
    id: 'engineTech',
    name: 'Tehnologie Motoare',
    description: 'Îmbunătățește viteza de deplasare a flotei.',
    cost: { metal: 350, crystal: 250, energy: 300 },
    duration: 60,
    effect: () => {
      // Aici ar trebui să modificăm o proprietate de viteză a flotei, dacă există
      showMessage('Tehnologie Motoare cercetată!');
    },
    unlock: () => (user.buildings.researchCenter || 0) >= 1
  }
];

export function showResearch() {
  const container = document.getElementById('researchTab');
  container.innerHTML = '';

  researchData.forEach(research => {
    const level = user.research[research.id] || 0;
    const isUnlocked = research.unlock();
    // Pentru calculul costului cercetării, putem folosi calculateCost dacă structura de cost e similară.
    // Altfel, am avea nevoie de o funcție de calcul a costului specifică pentru cercetare.
    const nextCost = calculateCost(research, level + 1);
    const div = document.createElement('div');
    div.className = `research-card ${!isUnlocked ? 'locked' : ''}`;
    div.innerHTML = `
      <h3>${research.name}</h3>
      <p>${research.description}</p>
      <p>Nivel: ${level}</p>
      <p>Cost cercetare: ${formatCost(nextCost)}</p>
      <button ${!isUnlocked ? 'disabled' : ''} data-research-id="${research.id}">Cercetează</button>
      <div class="progress-container"><div class="progress-bar"
      id="${research.id}-bar"></div><span class="progress-text" id="${research.id}-text"></span></div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll('#researchTab button').forEach(button => {
    button.addEventListener('click', () => {
      const researchId = button.dataset.researchId;
      startResearch(researchId);
    });
  });
}

function startResearch(id) {
  const research = researchData.find(r => r.id === id);
  const level = user.research[id] || 0;
  const cost = calculateCost(research, level + 1);

  if (!canAfford(cost)) {
    showMessage('Nu ai suficiente resurse.');
    return;
  }

  deductResources(cost);
  updateHUD();

  const progressBar = document.getElementById(`${id}-bar`);
  const text = document.getElementById(`${id}-text`);
  let seconds = research.duration;
  progressBar.style.width = '0%';
  let elapsed = 0;

  const interval = setInterval(() => {
    elapsed++;
    const percent = Math.min((elapsed / seconds) * 100, 100);
    progressBar.style.width = `${percent}%`;
    text.textContent = `${seconds - elapsed}s`;

    if (elapsed >= seconds) {
      clearInterval(interval);
      user.research[id] = level + 1;
      research.effect();
      showResearch();
      updateHUD();
      showMessage(`Cercetarea ${research.name} finalizată!`);
    }
  }, 1000);
}
