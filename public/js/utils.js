import { user } from './user.js';

function updateResources() {
  document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);
  document.getElementById('score').textContent = user.score || 0;
}

function showMessage(text) {
  const msg = document.getElementById('game-message');
  msg.textContent = text;
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 4000);
}

function handleOfflineProduction() {
  const last = localStorage.getItem('lastActive');
  const now = Date.now();
  if (!last) return;

  const diffSec = Math.floor((now - last) / 1000);
  const cappedSeconds = Math.min(diffSec, 8 * 3600);
  const minutes = Math.floor(cappedSeconds / 60);

  // Calculăm totalul per minut
  let metalRate = parseInt(document.getElementById('metalRate').textContent);
  let crystalRate = parseInt(document.getElementById('crystalRate').textContent);
  let energyRate = parseInt(document.getElementById('energyRate').textContent);

  user.resources.metal += metalRate * minutes;
  user.resources.crystal += crystalRate * minutes;
  user.resources.energy += energyRate * minutes;

  if (minutes > 0) {
    showMessage(`Ai produs offline: ${metalRate * minutes} metal, ${crystalRate * minutes} cristal, ${energyRate * minutes} energie`);
    updateResources();
  }
}

export { updateResources, showMessage, handleOfflineProduction };
