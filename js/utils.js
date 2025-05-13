// utils.js

import { user } from './user.js';
import { buildings } from './buildings.js';

export function getProd(id) {
  const b = buildings.find(x => x.id === id);
  return b.level > 0 ? b.production * b.level : 0;
}

export function getCost(building) {
  const mult = Math.pow(1.6, building.level + 1);
  return {
    metal: Math.floor(building.baseCost.metal * mult),
    crystal: Math.floor(building.baseCost.crystal * mult),
    energy: Math.floor(building.baseCost.energy * mult)
  };
}

export function updateResources() {
  const metalProd = getProd('metalMine');
  const crystalProd = getProd('crystalMine');
  const energyProd = getProd('powerPlant');

  document.getElementById('metal').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystal').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energy').textContent = Math.floor(user.resources.energy);
  document.getElementById('score').textContent = user.score;

  document.getElementById('metalRate').textContent = metalProd;
  document.getElementById('crystalRate').textContent = crystalProd;
  document.getElementById('energyRate').textContent = energyProd;
}

export function areMinesAtLevel5() {
  return buildings
    .filter(b => b.id.includes('Mine'))
    .every(b => b.level >= 5);
}

