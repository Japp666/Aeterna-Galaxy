import { user } from './user.js';

export function showHUD() {
  const hud = document.getElementById('hud');
  hud.innerHTML = `
    <div class="hud-bar">
      <span>Metal: <strong id="metalAmount">${user.resources.metal}</strong></span>
      <span>Cristal: <strong id="crystalAmount">${user.resources.crystal}</strong></span>
      <span>Energie: <strong id="energyAmount">${user.resources.energy}</strong></span>
      <span>Puncte: <strong id="scoreAmount">${user.score}</strong></span>
    </div>
  `;
  setInterval(updateHUD, 1000);
}

export function updateHUD() {
  document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);
  document.getElementById('scoreAmount').textContent = user.score;
}
