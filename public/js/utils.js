import { user } from './user.js';
import { updateHUD } from './hud.js';

export function getOfflineTime() {
  const now = Date.now();
  const diff = now - (user.lastOnline || now);
  return Math.min(diff, 8 * 60 * 60 * 1000); // max 8 ore
}

export function handleOfflineProduction() {
  const seconds = Math.floor(getOfflineTime() / 1000);
  const income = { metal: 0, crystal: 0, energy: 0 };

  for (const [key, level] of Object.entries(user.buildings)) {
    if (key.includes('Extractor')) {
      const base = 10 * level;
      if (key.includes('Metal')) income.metal += base * seconds;
      if (key.includes('Crystal')) income.crystal += base * seconds;
      if (key.includes('Energie')) income.energy += base * seconds;
    }
  }

  user.resources.metal += income.metal;
  user.resources.crystal += income.crystal;
  user.resources.energy += income.energy;

  updateHUD();
}

export function showMessage(text) {
  const el = document.createElement('div');
  el.className = 'game-message';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 4000);
}
