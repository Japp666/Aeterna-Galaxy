// Date de joc
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

// ===== Interfață inițială
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

// ===== UI
function initUI() {
  updateResources();
  renderBuildings();
  renderResearch();
  generateMap();
}

function updateResources() {
  document.getElementById('metal').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystal').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energy').textContent = Math.floor(user.resources.energy);
  document.getElementById('score').textContent = user.score;
}

// ===== Clădiri
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
      <p>Cost upgrade:<br>
        <small>Metal: ${cost.metal}, Cristal: ${cost.crystal}, Energie: ${cost.energy}</small>
      </p>
      <button onclick="upgradeBuilding('${building.id}')">Upgrade</button>
    `;
    container.appendChild(div);
  });
}

function getCost(building) {
  const mult = Math.pow(1.6, building.level);
  return {
    metal: Math.floor(building.baseCost.metal * mult),
    crystal: Math.floor(building.baseCost.crystal * mult),
    energy: Math.floor(building.baseCost.energy * mult)
  };
}

window.upgradeBuilding = (id) => {
  const b = buildings.find(x => x.id === id);
  if (!b || b.level >= b.max || b.building) return;

  const cost = getCost(b);
  const duration = 10 * 1000 + b.level * 2000; // 10 sec + 2 sec x nivel

  if (user.resources.metal < cost.metal ||
      user.resources.crystal < cost.crystal ||
      user.resources.energy < cost.energy) {
    return alert("Resurse insuficiente!");
  }

  user.resources.metal -= cost.metal;
  user.resources.crystal -= cost.crystal;
  user.resources.energy -= cost.energy;

  // blocăm construcția
  b.building = {
    startedAt: Date.now(),
    duration: duration
  };

  updateResources();
  renderBuildings();
};

// ===== Cercetări
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

  // aplicăm bonus la toate clădirile
  buildings.forEach(b => {
    b.production = Math.floor(b.production * 1.2);
  });

  updateResources();
  renderBuildings();
  renderResearch();
};

// ===== Hartă
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

// ===== Taburi
window.switchTab = (id) => {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
};
// Producție pasivă la fiecare secundă
setInterval(() => {
  const metalMine = buildings.find(b => b.id === 'metalMine');
  const crystalMine = buildings.find(b => b.id === 'crystalMine');
  const powerPlant = buildings.find(b => b.id === 'powerPlant');

  user.resources.metal += (metalMine.production * metalMine.level) / 60;
  user.resources.crystal += (crystalMine.production * crystalMine.level) / 60;
  user.resources.energy += (powerPlant.production * powerPlant.level) / 60;

  updateResources();
}, 1000);
