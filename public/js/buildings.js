import { getPlayer, addBuildingToQueue, updateResources } from './user.js';
import { showMessage } from './utils.js';

const buildingsData = [
    { id: 'power-plant', name: 'Centrală Energetică', cost: { metal: 50, crystal: 20 }, buildTime: 5, production: { energy: 10 }, maxLevel: 30, category: 'Economic' },
    { id: 'metal-mine', name: 'Mină de Metal', cost: { metal: 30, energy: 10 }, buildTime: 5, production: { metal: 5 }, maxLevel: 30, category: 'Economic' },
    { id: 'crystal-mine', name: 'Mină de Cristal', cost: { metal: 40, crystal: 15 }, buildTime: 5, production: { crystal: 3 }, maxLevel: 30, category: 'Economic' },
    { id: 'helium-mine', name: 'Mină de Heliu', cost: { metal: 60, crystal: 30 }, buildTime: 5, production: { helium: 2 }, maxLevel: 30, category: 'Economic' },
    { id: 'barracks', name: 'Cazarma', cost: { metal: 100, crystal: 50 }, buildTime: 10, units: ['soldiers'], maxLevel: 30, category: 'Militar' },
    { id: 'drone-factory', name: 'Fabrica de Drone', cost: { metal: 200, crystal: 100, energy: 50 }, buildTime: 15, units: ['drones'], maxLevel: 30, requires: { barracks: 3 }, category: 'Militar' },
    { id: 'tank-factory', name: 'Fabrica de Tancuri', cost: { metal: 300, crystal: 150, helium: 50 }, buildTime: 20, units: ['tanks'], maxLevel: 30, requires: { 'drone-factory': 2 }, category: 'Militar' },
    { id: 'hangar', name: 'Hangar', cost: { metal: 500, crystal: 250, helium: 100 }, buildTime: 25, units: ['aircraft'], maxLevel: 30, requires: { 'tank-factory': 3 }, category: 'Militar' },
    { id: 'logistics-depot', name: 'Depozit Logistic', cost: { metal: 400, crystal: 200, helium: 80 }, buildTime: 20, units: ['transports'], maxLevel: 30, requires: { 'research-center': 4 }, category: 'Militar' },
    { id: 'research-center', name: 'Centru de Cercetare', cost: { metal: 300, crystal: 150, energy: 50 }, buildTime: 15, maxLevel: 30, requires: { 'metal-mine': 3, 'crystal-mine': 3 }, category: 'Avansat' },
    { id: 'intel-center', name: 'Centru de Informații', cost: { metal: 350, crystal: 175, helium: 70 }, buildTime: 15, units: ['spy-drone'], maxLevel: 30, requires: { 'research-center': 4 }, category: 'Avansat' },
    { id: 'adv-research-center', name: 'Centru de Cercetare Avansat', cost: { metal: 1000, crystal: 500, helium: 200 }, buildTime: 30, maxLevel: 30, requires: { 'research-center': 15, 'metal-mine': 10 }, category: 'Avansat' },
    { id: 'metal-storage', name: 'Depozit de Metal', cost: { metal: 200, crystal: 100 }, buildTime: 10, storage: 1000, maxLevel: 30, requires: { 'metal-mine': 3 }, category: 'Economic' },
    { id: 'crystal-storage', name: 'Depozit de Cristal', cost: { metal: 200, crystal: 100 }, buildTime: 10, storage: 1000, maxLevel: 30, requires: { 'crystal-mine': 3 }, category: 'Economic' },
    { id: 'helium-storage', name: 'Depozit de Heliu', cost: { metal: 200, crystal: 100 }, buildTime: 10, storage: 1000, maxLevel: 30, requires: { 'helium-mine': 3 }, category: 'Economic' },
    { id: 'energy-storage', name: 'Depozit de Energie', cost: { metal: 200, crystal: 100 }, buildTime: 10, storage: 1000, maxLevel: 30, requires: { 'power-plant': 3 }, category: 'Economic' },
    { id: 'mining-drone-facility', name: 'Facilitate Drone de Minat', cost: { metal: 500, crystal: 200, helium: 50 }, buildTime: 15, drones: 1, maxLevel: 15, requires: { 'research-center': 5, 'metal-mine': 5 }, category: 'Economic' },
    { id: 'turret', name: 'Tureta', cost: { metal: 250, crystal: 125, energy: 50 }, buildTime: 10, defense: { damage: 50 }, maxLevel: 30, requires: { 'research-center': 3 }, category: 'Defensiv' },
    { id: 'anti-air', name: 'Antiaeriana', cost: { metal: 300, crystal: 150, helium: 60 }, buildTime: 10, defense: { damage: 40 }, maxLevel: 30, requires: { 'research-center': 5 }, category: 'Defensiv' }
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

    const categories = ['Economic', 'Militar', 'Defensiv', 'Avansat'];
    categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'building-category';
        categorySection.innerHTML = `<h2>${category}</h2>`;
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        categorySection.appendChild(categoryContainer);
        buildingsContainer.appendChild(categorySection);

        buildingsData.filter(b => b.category === category).forEach(building => {
            const player = getPlayer();
            const level = player.buildings[building.id]?.level || 0;
            const canBuild = !building.requires || Object.entries(building.requires).every(([reqId, reqLevel]) => player.buildings[reqId]?.level >= reqLevel);
            if (!canBuild && level === 0) return;

            const buildingCard = document.createElement('div');
            buildingCard.className = 'building-card';
            buildingCard.setAttribute('data-building-id', building.id);
            buildingCard.innerHTML = `
                <img src="https://i.postimg.cc/d07m01yM/fundal-joc.png" alt="${building.name}" class="building-image">
                <h3>${building.name} (Nivel ${level})</h3>
                <p>Cost: ${building.cost.metal} Metal, ${building.cost.crystal} Crystal${building.cost.helium ? `, ${building.cost.helium} Heliu` : ''}${building.cost.energy ? `, ${building.cost.energy} Energie` : ''}</p>
                <p>Build Time: ${building.buildTime} seconds</p>
                ${building.storage ? `<p>Storage: ${1000 * Math.pow(1.2, level)} units</p>` : ''}
                ${building.drones ? `<p>Drone: ${level}</p>` : ''}
                <button class="build-button" data-building-id="${building.id}" ${!canBuild || level >= building.maxLevel ? 'disabled' : ''}>Build/Upgrade</button>
                <div class="progress-bar-container"><div class="progress-bar" id="progress-${building.id}"></div></div>
                <div class="progress-timer" id="timer-${building.id}"></div>
            `;
            categoryContainer.appendChild(buildingCard);
        });
    });

    const buildButtons = buildingsContainer.querySelectorAll('.build-button');
    buildButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const player = getPlayer();
            const buildingId = event.target.dataset.buildingId;
            const building = buildingsData.find(b => b.id === buildingId);
            const level = player.buildings[building.id]?.level || 0;
            const buildTime = building.buildTime;

            const hasResources = player.resources.metal >= building.cost.metal &&
                                 player.resources.crystal >= building.cost.crystal &&
                                 (!building.cost.helium || player.resources.helium >= building.cost.helium) &&
                                 (!building.cost.energy || player.resources.energy >= building.cost.energy);

            if (hasResources) {
                try {
                    player.resources.metal -= building.cost.metal;
                    player.resources.crystal -= building.cost.crystal;
                    if (building.cost.helium) player.resources.helium -= building.cost.helium;
                    if (building.cost.energy) player.resources.energy -= building.cost.energy;
                    await addBuildingToQueue(buildingId, buildTime);
                    showMessage(`Construire ${building.name} nivelul ${level + 1} începută!`, 'success');
                    startProgressBar(buildingId, buildTime);
                } catch (error) {
                    console.error('Build error:', error);
                    showMessage('Eroare la construirea clădirii!', 'error');
                }
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        });
    });

    initDroneAllocation();
}

export function refreshBuildingUI(buildingId) {
    const player = getPlayer();
    const building = buildingsData.find(b => b.id === buildingId);
    if (!building) return;

    const buildingCard = document.querySelector(`.building-card[data-building-id="${buildingId}"]`);
    if (!buildingCard) return;

    const level = player.buildings[buildingId]?.level || 0;
    const canBuild = !building.requires || Object.entries(building.requires).every(([reqId, reqLevel]) => player.buildings[reqId]?.level >= reqLevel);

    buildingCard.innerHTML = `
        <img src="https://i.postimg.cc/d07m01yM/fundal-joc.png" alt="${building.name}" class="building-image">
        <h3>${building.name} (Nivel ${level})</h3>
        <p>Cost: ${building.cost.metal} Metal, ${building.cost.crystal} Crystal${building.cost.helium ? `, ${building.cost.helium} Heliu` : ''}${building.cost.energy ? `, ${building.cost.energy} Energie` : ''}</p>
        <p>Build Time: ${building.buildTime} seconds</p>
        ${building.storage ? `<p>Storage: ${1000 * Math.pow(1.2, level)} units</p>` : ''}
        ${building.drones ? `<p>Drone: ${level}</p>` : ''}
        <button class="build-button" data-building-id="${building.id}" ${!canBuild || level >= building.maxLevel ? 'disabled' : ''}>Build/Upgrade</button>
        <div class="progress-bar-container"><div class="progress-bar" id="progress-${building.id}"></div></div>
        <div class="progress-timer" id="timer-${building.id}"></div>
    `;

    const newButton = buildingCard.querySelector('.build-button');
    newButton.addEventListener('click', async (event) => {
        const player = getPlayer();
        const buildingId = event.target.dataset.buildingId;
        const building = buildingsData.find(b => b.id === buildingId);
        const level = player.buildings[building.id]?.level || 0;
        const buildTime = building.buildTime;

        const hasResources = player.resources.metal >= building.cost.metal &&
                             player.resources.crystal >= building.cost.crystal &&
                             (!building.cost.helium || player.resources.helium >= building.cost.helium) &&
                             (!building.cost.energy || player.resources.energy >= building.cost.energy);

        if (hasResources) {
            try {
                player.resources.metal -= building.cost.metal;
                player.resources.crystal -= building.cost.crystal;
                if (building.cost.helium) player.resources.helium -= building.cost.helium;
                if (building.cost.energy) player.resources.energy -= building.cost.energy;
                await addBuildingToQueue(buildingId, buildTime);
                showMessage(`Construire ${building.name} nivelul ${level + 1} începută!`, 'success');
                startProgressBar(buildingId, buildTime);
            } catch (error) {
                console.error('Build error:', error);
                showMessage('Eroare la construirea clădirii!', 'error');
            }
        } else {
            showMessage('Resurse insuficiente!', 'error');
        }
    });
}

function startProgressBar(buildingId, buildTime) {
    const progressBar = document.getElementById(`progress-${buildingId}`);
    const timerDisplay = document.getElementById(`timer-${buildingId}`);
    if (!progressBar || !timerDisplay) return;

    let progress = 0;
    let timeLeft = buildTime;
    progressBar.style.width = '0%';
    timerDisplay.textContent = `Timp rămas: ${timeLeft.toFixed(1)}s`;

    const interval = setInterval(() => {
        progress += 100 / (buildTime * 10);
        timeLeft -= 0.1;
        if (progress >= 100) {
            progress = 100;
            timeLeft = 0;
            clearInterval(interval);
            progressBar.style.width = '0%';
            timerDisplay.textContent = '';
        } else {
            progressBar.style.width = `${progress}%`;
            timerDisplay.textContent = `Timp rămas: ${timeLeft.toFixed(1)}s`;
        }
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
