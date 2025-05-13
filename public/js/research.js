// research.js

import { user } from './user.js';
import { buildings } from './buildings.js';
import { updateResources } from './utils.js';

export const research = [
  {
    id: 'miningTech',
    name: 'Tehnologie Minieră',
    level: 0,
    max: 5,
    effect: 'Crește producția cu 20%',
    cost: { metal: 300, crystal: 200, energy: 100 }
  }
];

export function renderResearch() {
  const container = document.getElementById('research-cards');
  container.innerHTML = '';

  research.forEach(res => {
    const div = document.createElement('div');
    const disabled = res.level >= res.max ? 'disabled' : '';
    div.className = 'card';

    div.innerHTML = `
      <h3>${res.name}</h3>
      <p>Nivel: ${res.level} / ${res.max}</p>
      <p>Efect: ${res.effect}</p>
      <p>Cost: Metal ${res.cost.metal}, Cristal ${res.cost.crystal}, Energie ${res.cost.energy}</p>
      <button onclick="doResearch('${res.id}')" ${disabled}>Cercetează</button>
    `;

    container.appendChild(div);
  });
}

export function doResearch(id) {
  const res = research.find(x => x.id === id);
  if (!res || res.level >= res.max) return;

  if (
    user.resources.metal < res.cost.metal ||
    user.resources.crystal < res.cost.crystal ||
    user.resources.energy < res.cost.energy
  ) {
    return alert("Resurse insuficiente!");
  }

  user.resources.metal -= res.cost.metal;
  user.resources.crystal -= res.cost.crystal;
  user.resources.energy -= res.cost.energy;

  res.level++;
  user.score += 25;

  // Aplică efectul cercetării: +20% producție
  buildings.forEach(b => {
    if (b.production > 0) {
      b.production = Math.floor(b.production * 1.2);
    }
  });

  updateResources();
  renderResearch();
}

