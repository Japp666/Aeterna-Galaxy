import { user } from './utils.js';

export function showHUD() {
  const hud = document.getElementById('hudBar');
  hud.innerHTML = `
    <span>Metal: <strong id="metalAmount">${user.resources.metal}</strong></span>
    <span>Crystal: <strong id="crystalAmount">${user.resources.crystal}</strong></span>
    <span>Energy: <strong id="energyAmount">${user.resources.energy}</strong></span>
    <span>Puncte: <strong id="scoreAmount">${user.score}</strong></span>
  `;

  setInterval(updateHUD, 1000);
}

export function updateHUD() {
  document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);
  document.getElementById('scoreAmount').textContent = user.score;
}
