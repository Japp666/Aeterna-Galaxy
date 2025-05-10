// ========== STARE UTILIZATOR ==========
let user = {
  name: '',
  race: '',
  resources: {
    metal: 1000,
    crystal: 800,
    energy: 500
  },
  score: 0
};

// ========== CLĂDIRI ==========
const buildings = [
  {
    id: 'metalMine',
    name: 'Extractor Metal',
    level: 1,
    max: 20,
    baseCost: { metal: 100, crystal: 50, energy: 20 },
    production: 20
  },
  {
    id: 'crystalMine',
    name: 'Extractor Cristal',
    level: 1,
    max: 20,
    baseCost: { metal: 80, crystal: 100, energy: 30 },
    production: 15
  },
  {
    id: 'powerPlant',
    name: 'Centrală Energetică',
    level: 1,
    max: 20,
    baseCost: { metal: 60, crystal: 60, energy: 0 },
    production: 10
  }
];

// ========== CERCETĂRI ==========
const research = [
  {
    id: 'miningTech',
    name: 'Tehnologie Minieră',
    level: 0,
    max: 5,
    effect: 'Crește producția cu 20%',
    cost: { metal: 300, crystal: 200, energy: 100 }
  }
];

// ========== LOGIN & RASĂ ==========
window.startGame = () => {
  const name = document.getElementById('username').value.trim();
  if (name.length < 3) return alert("Introdu un nume valid");
  user.name = name;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('race-screen').classList.remove('hidden');
};

window.selectRace = (race) => {
  user.race = race;
  document.getElementById('race-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  initUI();
};

// ========== UI ==========
function initUI() {
  updateResources();
  renderBuildings();
  renderResearch();
  generateMap();
}

// ========== TABURI ==========
window.switchTab = (id) => {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
};

// ========== RESURSE & PRODUCȚIE ==========
function updateResources() {
  const metalMine = buildings.find(b => b.id === 'metalMine');
  const crystalMine = buildings.find(b => b.id === 'crystalMine');
  const powerPlant = buildings.find(b => b.id === 'powerPlant');

  const metalProd = metalMine.production * metalMine.level;
  const crystalProd = crystalMine.production * crystalMine.level;
  const energyProd = powerPlant.production * powerPlant.level;

  document.getElementById('metal').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystal').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energy').textContent = Math.floor(user.resources.energy);
  document.getElementById('score').textContent = user.score;

  document.getElementById('metalRate').textContent = metalProd;
  document.getElementById('crystalRate').textContent = crystalProd;
  document.getElementById('energyRate').textContent = energyProd;
}

// ========== PRODUCȚIE AUTOMATĂ ==========
setInterval(() => {
  buildings.forEach(b => {
    if (!b.building) {
      const prod = b.production * b.level / 60;
      if (b.id === 'metalMine') user.resources.metal += prod;
      if (b.id === 'crystalMine') user.resources.crystal += prod;
      if (b.id === 'powerPlant') user.resources.energy += prod;
    }
  });
  updateResources();
  renderBuildings();
}, 1000);

// ========== COST UPGRADE ==========
function getCost(building) {
  const mult = Math.pow(1.6, building.level);
  return {
    metal: Math.floor(building.baseCost.metal * mult),
    crystal: Math.floor(building.baseCost.crystal * mult),
    energy: Math.floor(building.baseCost.energy * mult)
  };
}

// ========== UPGRADE CU TIMER & BARĂ ==========
window.upgradeBuilding = (id) => {
  const b = buildings.find(x => x.id === id);
  if (!b || b.level >= b.max || b.building) return;

  const cost = getCost(b);
  const duration = 10000 + b.level * 2000; // 10s + 2s x nivel

  if (user.resources.metal < cost.metal ||
      user.resources.crystal < cost.crystal ||
      user.resources.energy < cost.energy) {
    return alert("Resurse insuficiente!");
  }

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  b.building = {
    startedAt: Date.now(),
    duration: duration
  };

  updateResources();
  renderBuildings();
};

// ========== REDESENARE CLĂDIRI ==========
function renderBuildings() {
  const container = document.getElementById('building-cards');
  container.innerHTML = '';
  buildings.forEach(building => {
    const cost = getCost(building);
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${building.name}</h3>
      <p>Nivel: ${building.level} / ${building.max}</p>
      <p>Producție: ${building.production * building.level}/min</p>
      <p>Cost:<br>Metal: ${cost.metal}, Cristal: ${cost.crystal}, Energie: ${cost.energy}</p>
    `;

    if (building.building) {
      const elapsed = Date.now() - building.building.startedAt;
      const percent = Math.min((elapsed / building.building.duration) * 100, 100);
      const remaining = Math.ceil((building.building.duration - elapsed) / 1000);

      div.innerHTML += `
        <div class="progress-container">
          <div class="progress-bar" style="width: ${percent}%"></div>
          <div class="progress-timer">${remaining}s</div>
        </div>
      `;

      if (elapsed >= building.building.duration) {
        building.level++;
        user.score += 10;
        delete building.building;
        updateResources();
      }
    } else {
      div.innerHTML += `<button onclick="upgradeBuilding('${building.id}')">Upgrade</button>`;
    }

    container.appendChild(div);
  });
}

// ========== CERCETARE ==========
function renderResearch() {
  const container = document.getElementById('research-cards');
  container.innerHTML = '';
  research.forEach(res => {
    const div = document.createElement('div');
    const disabled = res.level >= res.max ? 'disabled' : '';
    div.className = 'card';
    div.innerHTML = `
      <h3>${res.name}</h3>
      <p>Nivel: ${res.level} / ${res.max}</p>
      <p>Efect: ${res.effect}</p>
      <p>Cost: Metal ${res.cost.metal}, Cristal ${res.cost.crystal}, Energie ${res.cost.energy}</p>
      <button onclick="doResearch('${res.id}')" ${disabled}>Cercetează</button>
    `;
    container.appendChild(div);
  });
}

window.doResearch = (id) => {
  const res = research.find(x => x.id === id);
  if (!res || res.level >= res.max) return;

  if (user.resources.metal < res.cost.metal ||
      user.resources.crystal < res.cost.crystal ||
      user.resources.energy < res.cost.energy) {
    return alert("Resurse insuficiente!");
  }

  user.resources.metal -= res.cost.metal;
  user.resources.crystal -= res.cost.crystal;
  user.resources.energy -= res.cost.energy;
  res.level++;
  user.score += 25;

  // aplicăm bonus la producție
  buildings.forEach(b => {
    b.production = Math.floor(b.production * 1.2);
  });

  updateResources();
  renderBuildings();
  renderResearch();
};

// ========== HARTĂ ==========
function generateMap() {
  const map = document.getElementById('map-grid');
  map.innerHTML = '';
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const div = document.createElement('div');
      div.className = 'map-cell';

      if (x === 4 && y === 4) {
        div.style.backgroundColor = '#0ff';
        div.setAttribute('data-info', `${user.name} • Puncte: ${user.score} • [${x},${y}]`);
      } else {
        div.setAttribute('data-info', `Coord: [${x},${y}]`);
      }

      map.appendChild(div);
    }
  }
}
