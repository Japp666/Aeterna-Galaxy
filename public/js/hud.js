import { user } from './user.js';

export function showHUD() {
  const hud = document.getElementById('hud');
  hud.innerHTML = `
    <div class="hud-bar">
      <span>Metal: <strong id="metalAmount">${user.resources.metal}</strong> (<span id="metalRate">0</span>/oră)</span>
      <span>Cristal: <strong id="crystalAmount">${user.resources.crystal}</strong> (<span id="crystalRate">0</span>/oră)</span>
      <span>Energie: <strong id="energyAmount">${user.resources.energy}</strong> (<span id="energyRate">0</span>/oră)</span>
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
  
  const metalRate = 10 * (user.buildings['metalMine'] || 0);
  const crystalRate = 7 * (user.buildings['crystalMine'] || 0);
  const energyRate = 5 * (user.buildings['energyPlant'] || 0);
  
  document.getElementById('metalRate').textContent = metalRate;
  document.getElementById('crystalRate').textContent = crystalRate;
  document.getElementById('energyRate').textContent = energyRate;
}
