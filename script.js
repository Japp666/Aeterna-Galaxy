// === Configuri rasă ===
const raceDescriptions = {
  Solari: "Solari sunt urmașii umanității, o specie care a evoluat prin adaptare tehnologică într-un viitor haotic. După secole de război și criză pe Pământ, o alianță globală a colonizat sistemele exterioare. Solari au dezvoltat tehnologii versatile și o infrastructură robustă, bazată pe eficiență militară și energetică.",
  Zydonian: "Zydonianii sunt o rasă psionică, existențe semi-eterice care trăiesc între realități. Descoperiți pentru prima dată lângă o anomalie gravitațională, ei manipulează energia mentală și câmpurile cuantice. Nimeni nu știe cu certitudine originea lor.",
  Vortak: "Vort’ak sunt o civilizație construită în întregime din entități mecanice. Ei au fost creați de o specie dispărută pentru a continua existența în univers. Raționali, reci și extrem de eficienți, Vortak operează în rețele distribuite și nu cunosc mila."
};

const raceBonuses = {
  Solari: ["+5% producție energine", "+10% apărare clădiri", "Timp construcție redus cu 10%"],
  Zydonian: ["+20% eficiență cercetare", "+10% regen energie", "Infiltrare ușoară în alte colonii"],
  Vortak: ["+15% armură nave", "+10% viteza de construcție", "Cost redus pentru clădiri militare"]
};

const raceResources = {
  Solari: ["Quartz", "Helium-3", "Electrical Energy"],
  Zydonian: ["Resonance Crystals", "Psionic Concentrate", "Etheryc Energy"],
  Vortak: ["Advanced Alloys", "Synthetic Compound", "Intense Energy Cell"]
};

// === Variabile de joc ===
let selectedRace = null;
let resourceLabels = [];
let res = [500, 300, 200];
let buildingLevels = [];
let selectedBuilding = -1;
let isBuilding = false;
let buildTimeLeft = 0;
let buildInterval = null;

const buildings = [
  {
    name: "Command Center",
    baseCost: [150, 100, 50],
    baseTime: 30,
    description: "Centru de comandă. Permite gestionarea coloniei."
  },
  {
    name: "Power Plant",
    baseCost: [100, 60, 30],
    baseTime: 20,
    description: "Produce energine."
  },
  {
    name: "Mine",
    baseCost: [80, 40, 20],
    baseTime: 20,
    description: "Extrage minerale."
  },
  {
    name: "Gas Extractor",
    baseCost: [90, 50, 25],
    baseTime: 20,
    description: "Extrage gaz."
  },
  {
    name: "Research Lab",
    baseCost: [200, 150, 100],
    baseTime: 40,
    description: "Dezvoltă tehnologii avansate."
  }
];

// === Selecție rasă ===
function selectRace(race) {
  selectedRace = race;
  resourceLabels = raceResources[race];
  buildingLevels = Array(buildings.length).fill(0);
  document.getElementById("raceSelection").style.display = "none";
  document.getElementById("gameUI").style.display = "flex";
  document.getElementById("raceTitle").innerText = `Colonia ${race}`;
  renderResources();
  renderBuildings();
  document.body.className = race.toLowerCase();
}

// === Info rasă ===
function showRaceInfo(race) {
  document.getElementById("popupTitle").innerText = race;
  document.getElementById("popupDescription").innerText = raceDescriptions[race];
  const bonuses = raceBonuses[race];
  const ul = document.getElementById("popupBonuses");
  ul.innerHTML = "";
  bonuses.forEach(b => {
    const li = document.createElement("li");
    li.innerText = b;
    ul.appendChild(li);
  });
  document.getElementById("raceInfoPopup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("raceInfoPopup").classList.add("hidden");
}

// === UI: resurse și clădiri ===
function renderResources() {
  for (let i = 0; i < 3; i++) {
    document.getElementById("res" + (i + 1)).innerText = `${resourceLabels[i]}: ${res[i]}`;
  }
}

function renderBuildings() {
  const list = document.getElementById("buildingList");
  list.innerHTML = "";
  buildings.forEach((b, i) => {
    const li = document.createElement("li");
    li.innerText = `${b.name} (Nivel ${buildingLevels[i]})`;
    li.onclick = () => selectBuilding(i);
    list.appendChild(li);
  });
}

function selectBuilding(index) {
  if (isBuilding) return;
  selectedBuilding = index;
  const b = buildings[index];
  const level = buildingLevels[index];
  const cost = b.baseCost.map(c => Math.floor(c * Math.pow(1.4, level)));
  const time = Math.floor(b.baseTime * Math.pow(1.35, level));
  document.getElementById("selectedBuildingTitle").innerText = `${b.name} (Nivel ${level})`;
  document.getElementById("buildingDescription").innerText = b.description;
  document.getElementById("buildingCost").innerText = `Cost: ${cost[0]}, ${cost[1]}, ${cost[2]}`;
  document.getElementById("buildingTime").innerText = `Timp: ${time} secunde`;
  document.getElementById("buildingTimer").innerText = ``;
  document.getElementById("upgradeButton").disabled = false;
}

// === Construcție ===
function upgradeBuilding() {
  if (isBuilding || selectedBuilding === -1) return;
  const b = buildings[selectedBuilding];
  const level = buildingLevels[selectedBuilding];
  const cost = b.baseCost.map(c => Math.floor(c * Math.pow(1.4, level)));
  const time = Math.floor(b.baseTime * Math.pow(1.35, level));
  if (cost.some((c, i) => res[i] < c)) {
    alert("Resurse insuficiente.");
    return;
  }
  for (let i = 0; i < 3; i++) res[i] -= cost[i];
  renderResources();
  isBuilding = true;
  buildTimeLeft = time;
  document.getElementById("upgradeButton").disabled = true;

  buildInterval = setInterval(() => {
    buildTimeLeft--;
    document.getElementById("buildingTimer").innerText = `Timp rămas: ${buildTimeLeft}s`;
    if (buildTimeLeft <= 0) {
      clearInterval(buildInterval);
      buildFinished();
    }
  }, 1000);
}

function buildFinished() {
  buildingLevels[selectedBuilding]++;
  isBuilding = false;
  renderBuildings();
  renderResources();
  selectBuilding(selectedBuilding);
  document.getElementById("upgradeButton").disabled = false;
  document.getElementById("upgradeButton").innerText = "Construiește / Upgrade";
  document.getElementById("buildingTimer").innerText = ``;
}

document.getElementById("upgradeButton").addEventListener("click", upgradeBuilding);
