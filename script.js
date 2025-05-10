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

let isBuildingInProgress = false;

const buildings = [
  {
    id: 'metalMine',
    name: 'Extractor Metal',
    level: 0,
    max: 20,
    baseCost: { metal: 100, crystal: 50, energy: 20 },
    production: 20
  },
  {
    id: 'crystalMine',
    name: 'Extractor Cristal',
    level: 0,
    max: 20,
    baseCost: { metal: 80, crystal: 100, energy: 30 },
    production: 15
  },
  {
    id: 'powerPlant',
    name: 'Centrală Energetică',
    level: 0,
    max: 20,
    baseCost: { metal: 60, crystal: 60, energy: 0 },
    production: 10
  },
  {
    id: 'researchLab',
    name: 'Laborator de Cercetare',
    level: 0,
    max: 10,
    baseCost: { metal: 500, crystal: 400, energy: 200 },
    production: 0
  }
];

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

// === LOGIN & RASĂ ===
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

function initUI() {
  updateResources();
  renderBuildings();
  renderResearch();
  generateMap();
}

function updateResources() {
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

function getProd(id) {
  const b = buildings.find(x => x.id === id);
  return b.level > 0 ? b.production * b.level : 0;
}
// === PRODUCȚIE PASIVĂ ===
setInterval(() => {
  buildings.forEach(b => {
    if (b.level > 0 && !b.building) {
      const prod = b.production * b.level / 60;
      if (b.id === 'metalMine') user.resources.metal += prod;
      if (b.id === 'crystalMine') user.resources.crystal += prod;
      if (b.id === 'powerPlant') user.resources.energy += prod;
    }
  });
  updateResources();
  renderBuildings();
}, 1000);

function getCost(building) {
  const mult = Math.pow(1.6, building.level + 1);
  return {
    metal: Math.floor(building.baseCost.metal * mult),
    crystal: Math.floor(building.baseCost.crystal * mult),
    energy: Math.floor(building.baseCost.energy * mult)
  };
}

function areMinesAtLevel5() {
  return buildings
    .filter(b => b.id.includes('Mine'))
    .every(b => b.level >= 5);
}

// === UPGRADE BUILDING ===
window.upgradeBuilding = (id) => {
  const b = buildings.find(x => x.id === id);
  if (!b || b.level >= b.max || b.building) return;

  if (isBuildingInProgress) {
    alert("O clădire este deja în construcție.");
    return;
  }

  const cost = getCost(b);
  const duration = 10000 + b.level * 2000;

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

  isBuildingInProgress = true;

  updateResources();
  renderBuildings();
};

// === RENDER BUILDINGS ===
function renderBuildings() {
  const container = document.getElementById('building-cards');
  container.innerHTML = '';
  buildings.forEach(building => {
    if (building.id === 'researchLab' && !areMinesAtLevel5()) return;

    const cost = getCost(building);
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <h3>${building.name}</h3>
      <p>Nivel: ${building.level} / ${building.max}</p>
      <p>Producție: ${getProd(building.id)}/min</p>
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
        isBuildingInProgress = false;
        updateResources();
      }
    } else {
      div.innerHTML += `<button onclick="upgradeBuilding('${building.id}')">Upgrade</button>`;
    }

    container.appendChild(div);
  });
}
// === RENDER CERCETARE ===
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

// === APLICARE CERCETARE ===
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

  // Bonus: +20% producție
  buildings.forEach(b => {
    if (b.production > 0) {
      b.production = Math.floor(b.production * 1.2);
    }
  });

  updateResources();
  renderBuildings();
  renderResearch();
};

// === GENERARE HARTĂ ===
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
