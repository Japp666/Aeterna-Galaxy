// Rase cu bonusuri
const races = {
  Syari: { resourceBonus: 10, techBonus: 1, fleetBonus: 2 },
  Aethel: { resourceBonus: 5, techBonus: 3, fleetBonus: 1 },
  Vortak: { resourceBonus: 8, techBonus: 2, fleetBonus: 3 }
};

// Jucător
let player = {
  race: null,
  resources: 0,
  techLevel: 0,
  fleetSize: 0,
  fleetShips: 0,
  techsUnlocked: new Set()
};

// Clădiri
const buildings = {
  mine: { level: 1, baseCost: 50, costMult: 2, production: 5 },
  lab: { level: 1, baseCost: 60, costMult: 2.2, production: 1 },
  hangar: { level: 1, baseCost: 80, costMult: 2.5, production: 1 }
};

// Tehnologii (tech tree simplificat)
const techTree = [
  {
    id: 'mining2',
    name: 'Mină Nivel 2',
    description: 'Crește producția minei cu 5',
    cost: 100,
    requires: [],
    apply: () => buildings.mine.production += 5
  },
  {
    id: 'lab2',
    name: 'Laborator Nivel 2',
    description: 'Crește producția laboratorului cu 1',
    cost: 150,
    requires: ['mining2'],
    apply: () => buildings.lab.production += 1
  },
  {
    id: 'hangar2',
    name: 'Hangar Nivel 2',
    description: 'Crește producția hangarului cu 1',
    cost: 200,
    requires: ['lab2'],
    apply: () => buildings.hangar.production += 1
  },
  {
    id: 'fleetUpgrade',
    name: 'Flotă Avansată',
    description: 'Crește puterea flotei cu 5',
    cost: 300,
    requires: ['hangar2'],
    apply: () => player.fleetSize += 5
  }
];

// Bot adversar simplu
let bot = {
  resources: 200,
  techLevel: 5,
  fleetSize: 10,
  fleetShips: 10
};

// DOM
const raceButtons = document.querySelectorAll('.race-btn');
const raceSelectionDiv = document.getElementById('raceSelection');
const gameDashboard = document.getElementById('game-dashboard');
const playerRaceSpan = document.getElementById('playerRace');
const resourceCountSpan = document.getElementById('resourceCount');
const techLevelSpan = document.getElementById('techLevel');
const fleetSizeSpan = document.getElementById('fleetSize');

const mineLevelSpan = document.getElementById('mineLevel');
const labLevelSpan = document.getElementById('labLevel');
const hangarLevelSpan = document.getElementById('hangarLevel');

const mineUpgradeCostSpan = document.getElementById('mineUpgradeCost');
const labUpgradeCostSpan = document.getElementById('labUpgradeCost');
const hangarUpgradeCostSpan = document.getElementById('hangarUpgradeCost');

const upgradeMineBtn = document.getElementById('upgradeMineBtn');
const upgradeLabBtn = document.getElementById('upgradeLabBtn');
const upgradeHangarBtn = document.getElementById('upgradeHangarBtn');

const techListDiv = document.getElementById('techList');

const fleetCountSpan = document.getElementById('fleetCount');
const buildShipBtn = document.getElementById('buildShipBtn');
const attackBotBtn = document.getElementById('attackBotBtn');
const battleLogDiv = document.getElementById('battleLog');

const activateBeaconBtn = document.getElementById('activateBeaconBtn');
const eventLogDiv = document.getElementById('eventLog');

// Selectare rasă
raceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedRace = btn.getAttribute('data-race');
    startGame(selectedRace);
  });
});

// Pornire joc
function startGame(race) {
  player.race = race;
  player.resources = 100 + races[race].resourceBonus;
  player.techLevel = 1 + races[race].techBonus;
  player.fleetSize = 5 + races[race].fleetBonus;
  player.fleetShips = player.fleetSize;

  raceSelectionDiv.style.display = 'none';
  gameDashboard.style.display = 'block';

  updateBuildingsUI();
  updateUI();
  renderTechTree();
  updateFleetUI();
  logEvent(`Jocul a început ca rasa ${race}.`);
}

// Actualizare UI resurse și clădiri
function updateUI() {
  playerRaceSpan.textContent = player.race;
  resourceCountSpan.textContent = Math.floor(player.resources);
  techLevelSpan.textContent = Math.floor(player.techLevel);
  fleetSizeSpan.textContent = Math.floor(player.fleetSize);
}

function updateBuildingsUI() {
  mineLevelSpan.textContent = buildings.mine.level;
  labLevelSpan.textContent = buildings.lab.level;
  hangarLevelSpan.textContent = buildings.hangar.level;

  mineUpgradeCostSpan.textContent = 'Cost: ' + getUpgradeCost('mine') + ' resurse';
  labUpgradeCostSpan.textContent = 'Cost: ' + getUpgradeCost('lab') + ' resurse';
  hangarUpgradeCostSpan.textContent = 'Cost: ' + getUpgradeCost('hangar') + ' resurse';
}

function updateFleetUI() {
  fleetCountSpan.textContent = player.fleetShips;
}

// Calcul cost upgrade clădire
function getUpgradeCost(building) {
  const b = buildings[building];
  return Math.floor(b.baseCost * Math.pow(b.costMult, b.level - 1));
}

// Upgrade clădire
function upgradeBuilding(building) {
  const cost = getUpgradeCost(building);
  if (player.resources >= cost) {
    player.resources -= cost;
    buildings[building].level++;
    updateBuildingsUI();
    updateUI();
    logEvent(`Ai upgradat clădirea ${building} la nivelul ${buildings[building].level}.`);
  } else {
    alert('Nu ai suficiente resurse!');
  }
}

// Ascultători butoane upgrade
upgradeMineBtn.addEventListener('click', () => upgradeBuilding('mine'));
upgradeLabBtn.addEventListener('click', () => upgradeBuilding('lab'));
upgradeHangarBtn.addEventListener('click', () => upgradeBuilding('hangar'));

// Producție periodică (la fiecare 5 secunde)
setInterval(() => {
  player.resources += buildings.mine.level * buildings.mine.production;
  player.techLevel += buildings.lab.level * buildings.lab.production;
  player.fleetSize += buildings.hangar.level * buildings.hangar.production;
  player.fleetShips += buildings.hangar.level * buildings.hangar.production;

  updateUI();
  updateFleetUI();
}, 5000);

// Render tech tree
function renderTechTree() {
  techListDiv.innerHTML = '';
  techTree.forEach(tech => {
    const div = document.createElement('div');
    div.classList.add('tech-item');

    if (player.techsUnlocked.has(tech.id)) {
      div.classList.add('unlocked');
    } else if (canUnlockTech(tech)) {
      div.classList.remove('locked');
    } else {
      div.classList.add('locked');
    }

    div.innerHTML = `
      <div class="tech-name">${tech.name}</div>
      <div class="tech-desc">${tech.description}</div>
      <div class="tech-cost">Cost: ${tech.cost} tehnologie</div>
    `;

    if (!player.techsUnlocked.has(tech.id) && canUnlockTech(tech)) {
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => unlockTech(tech));
    }

    techListDiv.appendChild(div);
  });
}

function canUnlockTech(tech) {
  // Verifică dacă toate tehnologiile cerute sunt deblocate
  return tech.requires.every(req => player.techsUnlocked.has(req)) && player.techLevel >= tech.cost;
}

function unlockTech(tech) {
  if (player.techLevel >= tech.cost) {
    player.techLevel -= tech.cost;
    player.techsUnlocked.add(tech.id);
    tech.apply();
    renderTechTree();
    updateUI();
    logEvent(`Ai deblocat tehnologia: ${tech.name}`);
  } else {
    alert('Nu ai suficientă tehnologie pentru a debloca această tehnologie!');
  }
}

// Construiește navă
buildShipBtn.addEventListener('click', () => {
  if (player.resources >= 20) {
    player.resources -= 20;
    player.fleetShips++;
    updateUI();
    updateFleetUI();
    logEvent('Ai construit o navă nouă.');
  } else {
    alert('Nu ai suficiente resurse pentru a construi o navă!');
  }
});

// Simulare bătălie cu bot
attackBotBtn.addEventListener('click', () => {
  if (player.fleetShips <= 0) {
    alert('Nu ai nave în flotă pentru a ataca!');
    return;
  }

  logBattle('Bătălia a început!');

  // Calcul putere flote
  const playerPower = player.fleetShips * 10 + player.techsUnlocked.has('fleetUpgrade') ? 50 : 0;
  const botPower = bot.fleetShips * 8 + bot.techLevel * 5;

  // Simulare simplă
  if (playerPower >= botPower) {
    logBattle('Ai câștigat bătălia!');
    bot.fleetShips = Math.max(0, bot.fleetShips - Math.floor(player.fleetShips / 2));
    player.fleetShips = Math.max(1, player.fleetShips - Math.floor(bot.fleetShips / 3));
    player.resources += 50;
    player.techLevel += 10;
  } else {
    logBattle('Ai pierdut bătălia!');
    player.fleetShips = Math.max(0, player.fleetShips - Math.floor(bot.fleetShips / 2));
    bot.fleetShips = Math.max(1, bot.fleetShips - Math.floor(player.fleetShips / 3));
  }
  updateFleetUI();
  updateUI();
});

// Log bătălie
function logBattle(text) {
  const p = document.createElement('p');
  p.textContent = text;
  battleLogDiv.prepend(p);
}

// Eveniment final - beacon
activateBeaconBtn.addEventListener('click', () => {
  if (player.techLevel >= 500) {
    logEvent('Beacon-ul a fost activat! Felicitări, ai câștigat jocul!');
    alert('Felicitări! Ai câștigat jocul activând beacon-ul!');
    resetGame();
  } else {
    alert('Nu ai suficientă tehnologie pentru a activa beacon-ul!');
  }
});

function logEvent(text) {
  const p = document.createElement('p');
  p.textContent = text;
  eventLogDiv.prepend(p);
}

function resetGame() {
  location.reload();
}
