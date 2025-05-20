import { user } from './user.js';

export function showHUD() {
  const hud = document.getElementById('hud'); // Am modificat id-ul aici
  hud.innerHTML = `
    <div class="hud-bar">
      <div>Metal: <span id="metalAmount">${Math.floor(user.resources.metal)}</span> <small>(+<span id="metalRate">0</span>/min)</small></div>
      <div>Cristal: <span id="crystalAmount">${Math.floor(user.resources.crystal)}</span> <small>(+<span id="crystalRate">0</span>/min)</small></div>
      <div>Energie: <span id="energyAmount">${Math.floor(user.resources.energy)}</span> <small>(+<span id="energyRate">0</span>/min)</small></div>
      <div>Puncte: <span id="scoreAmount">${user.score}</span></div>
      <div id="tutorial-box" class="tutorial-box"></div>
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
