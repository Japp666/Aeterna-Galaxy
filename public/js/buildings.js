import { getPlayer, addBuildingToQueue, updateResources } from './user.js';
import { showMessage } from './utils.js';

const buildingsData = [
    { id: 'power-plant', name: 'Centrală Energetică', cost: { metal: 50, crystal: 20 }, buildTime: 30, production: { energy: 10 }, maxLevel: 30 },
    { id: 'metal-mine', name: 'Mină de Metal', cost: { metal: 30, energy: 10 }, buildTime: 20, production: { metal: 5 }, maxLevel: 50 },
    { id: 'crystal-mine', name: 'Mină de Cristal', cost: { metal: 40, crystal: 15 }, buildTime: 25, production: { crystal: 3 }, maxLevel: 30 },
    { id: 'helium-mine', name: 'Mină de Heliu', cost: { metal: 60, crystal: 30 }, buildTime: 40, production: { helium: 2 }, maxLevel: 30 },
    { id: 'barracks', name: 'Cazarma', cost: { metal: 100, crystal: 50 }, buildTime: 60, units: ['soldiers'], maxLevel: 30 },
    { id: 'drone-factory', name: 'Fabrica de Drone', cost: { metal: 200, crystal: 100, energy: 50 }, buildTime: 90, units: ['drones'], maxLevel: 30, requires: { barracks: 3 } },
    { id: 'tank-factory', name: 'Fabrica de Tancuri', cost: { metal: 300, crystal: 150, helium: 50 }, buildTime: 120, units: ['tanks'], maxLevel: 30, requires: { 'drone-factory': 2 } },
    { id: 'hangar', name: 'Hangar', cost: { metal: 500, crystal: 250, helium: 100 }, buildTime: 180, units: ['aircraft'], maxLevel: 30, requires: { 'tank-factory': 3 } },
    { id: 'logistics-depot', name: 'Depozit Logistic', cost: { metal: 400, crystal: 200, helium: 80 }, buildTime: 150, units: ['transports'], maxLevel: 30, requires: { 'research-center': 4 } },
    { id: 'research-center', name: 'Centru de Cercetare', cost: { metal: 300, crystal: 150, energy: 50 }, buildTime: 100, maxLevel: 30, requires: { 'metal-mine': 3, 'crystal-mine': 3 } },
    { id: 'intel-center', name: 'Centru de Informații', cost: { metal: 350, crystal: 175, helium: 70 }, buildTime: 120, units: ['spy-drone'], maxLevel: 30, requires: { 'research-center': 4 } },
    { id: 'adv-research-center', name: 'Centru de Cercetare Avansat', cost: { metal: 1000, crystal: 500, helium: 200 }, buildTime: 300, maxLevel: 30, requires: { 'research-center': 15, 'metal-mine': 10 } },
    { id: 'metal-storage', name: 'Depozit de Metal', cost: { metal: 200, crystal: 100 }, buildTime: 50, storage: 1000, maxLevel: 30, requires: { 'metal-mine': 3 } },
    { id: 'crystal-storage', name: 'Depozit de Cristal', cost: { metal bioinformatics: 200, crystal: 100 }, buildTime: 50, storage: 1000, maxLevel: 30, requires: { 'crystal-mine': 3 } },
    { id: 'helium-storage', name: 'Depozit de Heliu', cost: { metal: 200, crystal: 100 }, buildTime: 50, storage: 1000, maxLevel: 30, requires: { 'helium-mine': 3 } },
    { id: 'energy-storage', name: 'Depozit de Energie', cost: { metal: 200, crystal: 100 }, buildTime: 50, storage: 1000, maxLevel: 30, requires: { 'power-plant': 3 } },
    { id: 'mining-drone', name: 'Facilitate Drone de Minat', cost: { metal: 500, crystal: 200, helium: 50 }, buildTime: 100, drones: 1, maxLevel: 15, requires: { 'research-center': 5, 'metal-mine': 5 } },
    { id: 'turret', name: 'Tureta', cost: { metal: 250, crystal: 125, energy: 50 }, buildTime: 80, defense: { damage: 50 }, maxLevel: 30, requires: { 'research-center': 3 } },
    { id: 'anti-air', name: 'Antiaeriana', cost: { metal: 300, crystal: 150, helium: 60 }, buildTime: 100, defense: { damage: 40 }, maxLevel: 30, requires: { 'research-center': 5 } }
];

let constructionSlots = 1;
let researchSlots = 1;

export function initBuildingsPage() {
    const buildingsContainer = document.querySelector('.buildings-container');
    if (!buildingsContainer) {
        console.error("Elementul .buildings-container nu a fost găsit.");
        return;
    }
    buildingsContainer.innerHTML = '';

    buildingsData.forEach(building => {
        const player = getPlayer();
        const level = player.buildings[building.id]?.level || 0;
        const canBuild = !building.requires || Object.entries(building.requires).every(([reqId, reqLevel]) => player.buildings[reqId]?.level >= reqLevel);
        if (!canBuild && level === 0) return;

        const buildingCard = document.createElement('div');
        buildingCard.className = 'building-card';
        buildingCard.innerHTML = `
            <img src="https://i.postimg.cc/d07m01yM/fundal-joc.png" alt="${building.name}" class="building-image">
            <h3>${building.name} (Nivel ${level})</h3>
            <p>Cost: ${building.cost.metal} Metal, ${building.cost.crystal} Crystal${building.cost.helium ? `, ${building.cost.helium} Heliu` : ''}${building.cost.energy ? `, ${building.cost.energy} Energie` : ''}</p>
            <p>Build Time: ${building.buildTime * (1 + level * 0.5)} seconds</p>
            ${building.storage ? `<p>Storage: ${1000 * Math.pow(1.2, level)} units</p>` : ''}
            ${building.drones ? `<p>Drone: ${level}</p>` : ''}
            <button class="build-button" data-building-id="${building.id}" ${!canBuild || level >= building.maxLevel ? 'disabled' : ''}>Build/Upgrade</button>
            <div class="progress-bar-container"><div class="progress-bar" id="progress-${building.id}"></div></div>
            <div class="progress-timer" id="timer-${building.id}"></div>
        `;
        buildingsContainer.appendChild(buildingCard);
    });

    const buildButtons = buildingsContainer.querySelectorAll('.build-button');
    buildButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const player = getPlayer(); // Mutăm getPlayer în handler
            if (player.activeConstructions >= constructionSlots) {
                showMessage('Toate sloturile de construcție sunt ocupate!', 'error');
                return;
            }
            const buildingId = event.target.dataset.buildingId;
            const building = buildingsData.find(b => b.id === buildingId);
            const level = player.buildings[building.id]?.level || 0;
            const buildTime = building.buildTime * (1 + level * 0.5);

            if (player.resources.metal >= building.cost.metal && player.resources.crystal >= building.cost.crystal &&
                (!building.cost.helium || player.resources.helium >= building.cost.helium) &&
                (!building.cost.energy || player.resources.energy >= building.cost.energy)) {
                try {
                    await addBuildingToQueue(buildingId, buildTime);
                    showMessage(`Construire ${building.name} nivelul ${level + 1} începută!`, 'success');
                    startProgressBar(buildingId, buildTime);
                } catch (error) {
                    showMessage('Eroare la construirea clădirii!', 'error');
                }
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        });
    });

    initDroneAllocation();
}

function startProgressBar(buildingId, buildTime) {
    const progressBar = document.getElementById(`progress-${buildingId}`);
    const timerDisplay = document.getElementById(`timer-${buildingId}`);
    if (!progressBar || !timerDisplay) return;

    let progress = 0;
    let timeLeft = buildTime;
    const interval = setInterval(() => {
        progress += 100 / (buildTime * 10);
        timeLeft -= 0.1;
        if (progress >= 100) {
            progress = 100;
            timeLeft = 0;
            clearInterval(interval);
        }
        progressBar.style.width = `${progress}%`;
        timerDisplay.textContent = `Timp rămas: ${timeLeft.toFixed(1)}s`;
    }, 100);
}

function initDroneAllocation() {
    const player = getPlayer();
    const droneFacility = player.buildings['mining-drone-facility'];
    if (!droneFacility) return;

    const droneContainer = document.createElement('div');
    droneContainer.className = 'drone-allocation';
    droneContainer.innerHTML = `
        <h3>Alocare Drone de Minat (${droneFacility.level} drone disponibile)</h3>
        <div>
            <label>Mină de Metal: <input type="number" id="drone-metal" min="0" max="${droneFacility.level}" value="${player.drones?.metal || 0}"></label>
            <p>Producție: +${(player.drones?.metal || 0) * 8}%</p>
        </div>
        <div>
            <label>Mină de Cristal: <input type="number" id="drone-crystal" min="0" max="${droneFacility.level}" value="${player.drones?.crystal || 0}"></label>
            <p>Producție: +${(player.drones?.crystal || 0) * 8}%</p>
        </div>
        <div>
            <label>Mină de Heliu: <input type="number" id="drone-helium" min="0" max="${droneFacility.level}" value="${player.drones?.helium || 0}"></label>
            <p>Producție: +${(player.drones?.helium || 0) * 8}%</p>
        </div>
        <button class="save-drone-allocation">Salvează</button>
    `;
    document.querySelector('.buildings-container').appendChild(droneContainer);

    document.querySelector('.save-drone-allocation').addEventListener('click', () => {
        const metalDrones = parseInt(document.getElementById('drone-metal').value) || 0;
        const crystalDrones = parseInt(document.getElementById('drone-crystal').value) || 0;
        const heliumDrones = parseInt(document.getElementById('drone-helium').value) || 0;

        if (metalDrones + crystalDrones + heliumDrones > droneFacility.level) {
            showMessage('Prea multe drone alocate!', 'error');
            return;
        }

        player.drones = { metal: metalDrones, crystal: crystalDrones, helium: heliumDrones };
        updateResources();
        showMessage('Drone alocate cu succes!', 'success');
    });
}

export function updateConstructionSlots(level) {
    constructionSlots = 1 + level;
}

export function updateResearchSlots(level) {
    researchSlots = 1 + level;
}
