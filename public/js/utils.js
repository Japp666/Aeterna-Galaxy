import { user } from './user.js';

function updateResources() {
  document.getElementById('metal').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystal').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energy').textContent = Math.floor(user.resources.energy);
  document.getElementById('score').textContent = user.score;
}

export { updateResources };
