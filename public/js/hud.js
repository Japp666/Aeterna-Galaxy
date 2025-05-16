import { user } from './user.js';

export function initializeHUD() {
  const hud = document.getElementById('hud');
  hud.innerHTML = `
    <div>Metal: <span id="metal">${user.resources.metal}</span></div>
    <div>Crystal: <span id="crystal">${user.resources.crystal}</span></div>
    <div>Energy: <span id="energy">${user.resources.energy}</span></div>
    <div>Puncte: <span id="score">${user.score}</span></div>
  `;
}

export function updateHUD() {
  document.getElementById('metal').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystal').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energy').textContent = Math.floor(user.resources.energy);
  document.getElementById('score').textContent = user.score;
}
