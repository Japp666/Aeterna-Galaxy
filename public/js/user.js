const user = {
  name: '',
  race: '',
  resources: {
    metal: 500,
    crystal: 300,
    energy: 200
  },
  score: 0,
  buildings: {},
  research: {},
  fleet: {
    small: 0,
    medium: 0,
    large: 0
  },
  lastOnline: Date.now()
};

function updateResources(type, amount) {
  if (user.resources[type] !== undefined) {
    user.resources[type] += amount;
  }
}

function deductResources(cost) {
  Object.keys(cost).forEach(resource => {
    if (user.resources[resource] >= cost[resource]) {
      user.resources[resource] -= cost[resource];
    }
  });
}

function canAfford(cost) {
  return Object.keys(cost).every(resource => user.resources[resource] >= cost[resource]);
}

function updateScore(points) {
  user.score += points;
}

function showMessage(text) {
  alert(text);
}

function updateHUD() {
  document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);
  document.getElementById('scoreAmount').textContent = user.score;
  
  // Producția se calculează ca: (baza * nivel)
  const metalRate = 10 * (user.buildings['metalMine'] || 0);
  const crystalRate = 7 * (user.buildings['crystalMine'] || 0);
  const energyRate = 5 * (user.buildings['energyPlant'] || 0);
  
  document.getElementById('metalRate').textContent = metalRate;
  document.getElementById('crystalRate').textContent = crystalRate;
  document.getElementById('energyRate').textContent = energyRate;
}

export { user, updateResources, deductResources, canAfford, updateScore, showMessage, updateHUD };
