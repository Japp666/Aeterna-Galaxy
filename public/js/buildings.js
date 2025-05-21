// js/buildings.js

import { getUserData, updateResources, updateProduction, setUserBuildingLevel, getPlayerRace } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

// Definim structura de bază a clădirilor
const buildings = {
    metalMine: {
        name: "Mină de Metal",
        description: "Crește producția de Metal.",
        baseCost: { metal: 60, crystal: 15, energy: 0 },
        baseProduction: { metal: 10, crystal: 0, energy: 0 },
        energyConsumption: 5, // Consumă energie
        buildTime: 10000, // 10 secunde
        imageUrl: "img/solari/01-extractor-de-metal-solari.jpg",
        maxLevel: 10 // Adăugat un nivel maxim
    },
    crystalMine: {
        name: "Mină de Cristal",
        description: "Crește producția de Cristal.",
        baseCost: { metal: 75, crystal: 30, energy: 0 },
        baseProduction: { metal: 0, crystal: 5, energy: 0 },
        energyConsumption: 10,
        buildTime: 15000, // 15 secunde
        imageUrl: "img/solari/03-extractor-de-crystal-solari.jpg",
        maxLevel: 10
    },
    solarPlant: {
        name: "Centrală Solară",
        description: "Generează Energie pentru baza ta.",
        baseCost: { metal: 50, crystal: 10, energy: 0 },
        baseProduction: { metal: 0, crystal: 0, energy: 10 }, // Produce energie
        energyConsumption: 0, // Nu consumă energie, produce
        buildTime: 8000, // 8 secunde
        imageUrl: "img/solari/04-extractor-de-energie-solari.jpg",
        maxLevel: 10
    },
    heliumExtractor: { // Noua clădire
        name: "Extractor Heliu-2025",
        description: "Extrage Heliu-2025, o resursă rară necesară pentru tehnologii avansate și propulsie.",
        baseCost: { metal: 200, crystal: 100, energy: 50 },
        baseProduction: { metal: 0, crystal: 0, energy: 0, helium: 1 }, // Adaugă "helium" ca resursă
        energyConsumption: 25,
        buildTime: 45000, // 45 secunde
        imageUrl: "img/solari/02-extractor-de-heliu-2025-solari.jpg",
        maxLevel: 5
    }
};

const buildingQueue = {}; // Coada de construcție { buildingId: { level: X, endTime: Y, element: Z } }

export function renderBuildings() {
    const buildingsTab = document.getElementById('buildingsTab');
    if (!buildingsTab) {
        console.error("buildingsTab element not found!");
        return;
    }
    buildingsTab.innerHTML = '<h2>Clădiri</h2><p>Construiește și modernizează clădirile din baza ta. Fiecare clădire are un rol specific, de la producția de resurse la apărare și cercetare.</p><div class="building-list"></div>';
    const buildingList = buildingsTab.querySelector('.building-list');

    const userBuildings = getUserData().buildings; // Obținem clădirile utilizatorului

    for (const id in buildings) {
        const building = buildings[id];
        const currentLevel = userBuildings[id] || 0;
        const nextLevel = currentLevel + 1;

        if (nextLevel > building.maxLevel) {
            // Clădirea a atins nivelul maxim
            const buildingCard = document.createElement('div');
            buildingCard.className = 'building-card';
            buildingCard.innerHTML = `
                <img src="${building.imageUrl}" alt="${building.name}" class="building-image">
                <h3>${building.name}</h3>
                <p>Nivel: ${currentLevel} (Max)</p>
                <p>${building.description}</p>
                <button disabled>Nivel Maxim Atingut</button>
            `;
            buildingList.appendChild(buildingCard);
            continue;
        }

        const cost = calculateCost(building.baseCost, nextLevel);
        const production = calculateProduction(building.baseProduction, nextLevel, id);
        const energyRequired = calculateEnergyConsumption(building.energyConsumption, nextLevel, id);
        const buildTime = calculateBuildTime(building.buildTime, nextLevel);

        const buildingCard = document.createElement('div');
        buildingCard.className = 'building-card';
        buildingCard.dataset.id = id;

        buildingCard.innerHTML = `
            <img src="${building.imageUrl}" alt="${building.name}" class="building-image">
            <h3>${building.name}</h3>
            <p>Nivel: ${currentLevel}</p>
            <p>${building.description}</p>
            <p>Cost Nivel ${nextLevel}: Metal: ${cost.metal}, Cristal: ${cost.crystal}, Energie: ${energyRequired}</p>
            ${building.baseProduction.metal > 0 ? `<p>Producție Metal: +${production.metal}/h</p>` : ''}
            ${building.baseProduction.crystal > 0 ? `<p>Producție Cristal: +${production.crystal}/h</p>` : ''}
            ${building.baseProduction.energy > 0 ? `<p>Producție Energie: +${production.energy}/h</p>` : ''}
            ${building.baseProduction.helium > 0 ? `<p>Producție Heliu-2025: +${production.helium}/h</p>` : ''}
            ${building.energyConsumption > 0 && building.baseProduction.energy === 0 ? `<p>Consum Energie: ${energyRequired}</p>` : ''}
            <p>Timp construcție: ${formatTime(buildTime / 1000)}</p>
            <button class="build-btn" data-id="${id}"
                    data-metal="${cost.metal}"
                    data-crystal="${cost.crystal}"
                    data-energy="${energyRequired}"
                    data-time="${buildTime}">Construiește Nivel ${nextLevel}</button>
            <div class="progress-container" style="display: none;">
                <div class="progress-bar"></div>
                <div class="progress-text"></div>
            </div>
        `;
        buildingList.appendChild(buildingCard);
    }

    addBuildingEventListeners();
    updateBuildingProgressBars(); // Inițializează barele de progres la randare
}

function addBuildingEventListeners() {
    document.querySelectorAll('.build-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const buildingId = event.target.dataset.id;
            const costMetal = parseInt(event.target.dataset.metal);
            const costCrystal = parseInt(event.target.dataset.crystal);
            const costEnergy = parseInt(event.target.dataset.energy);
            const buildTime = parseInt(event.target.dataset.time);

            const userData = getUserData(); // Obținem datele actualizate ale utilizatorului

            // Verifică dacă resursa totală de energie (producție) suportă noul consum
            const currentEnergyProduction = userData.production.energy;
            const buildingEnergyConsumption = calculateEnergyConsumption(buildings[buildingId].energyConsumption, (userData.buildings[buildingId] || 0) + 1, buildingId);

            // Calculează consumul total de energie dacă această clădire ar fi construită
            let totalEnergyConsumptionIfBuilt = 0;
            for (const id in userData.buildings) {
                if (buildings[id].energyConsumption > 0 && buildings[id].baseProduction.energy === 0) { // Doar clădirile care consumă energie
                    totalEnergyConsumptionIfBuilt += calculateEnergyConsumption(buildings[id].energyConsumption, userData.buildings[id], id);
                }
            }
            // Adaugă consumul noii clădiri dacă va fi construită
            if (buildings[buildingId].energyConsumption > 0 && buildings[buildingId].baseProduction.energy === 0) {
                 totalEnergyConsumptionIfBuilt += buildingEnergyConsumption;
            }

            // Calculează producția totală de energie
            let totalEnergyProduction = 0;
            for (const id in userData.buildings) {
                 if (buildings[id].baseProduction.energy > 0) { // Doar clădirile care produc energie
                    totalEnergyProduction += calculateProduction(buildings[id].baseProduction, userData.buildings[id], id).energy;
                 }
            }
            // Adaugă producția noii clădiri dacă va fi construită
            if (buildings[buildingId].baseProduction.energy > 0) {
                totalEnergyProduction += calculateProduction(buildings[buildingId].baseProduction, (userData.buildings[buildingId] || 0) + 1, buildingId).energy;
            }


            // Verifică dacă jucătorul are suficiente resurse
            if (userData.resources.metal < costMetal || userData.resources.crystal < costCrystal || userData.resources.energy < costEnergy) {
                showMessage("Resurse insuficiente!", "error");
                return;
            }

            // Verifică dacă producția de energie este suficientă după construcție (dacă clădirea consumă energie)
            if (buildings[buildingId].energyConsumption > 0 && (totalEnergyProduction - totalEnergyConsumptionIfBuilt < 0)) {
                showMessage("Nu ai suficientă energie pentru a construi această clădire! Construiește mai întâi o centrală solară.", "error");
                return;
            }

            // Verifică dacă clădirea este deja în construcție
            if (buildingQueue[buildingId]) {
                showMessage("Această clădire este deja în construcție!", "info");
                return;
            }


            // Scade resursele
            updateResources(-costMetal, -costCrystal, -costEnergy);
            updateHUD(); // Actualizează HUD-ul imediat după scăderea resurselor
            showMessage(`Construcție "${buildings[buildingId].name}" Nivel ${ (userData.buildings[buildingId] || 0) + 1 } începută!`, "success");


            // Inițiază bara de progres
            const card = event.target.closest('.building-card');
            const progressBarContainer = card.querySelector('.progress-container');
            const progressBar = card.querySelector('.progress-bar');
            const progressText = card.querySelector('.progress-text');
            const buildButton = event.target;

            buildButton.disabled = true; // Dezactivează butonul
            progressBarContainer.style.display = 'block';

            const startTime = Date.now();
            const endTime = startTime + buildTime;

            // Adaugă la coada de construcție
            buildingQueue[buildingId] = {
                level: (userData.buildings[buildingId] || 0) + 1,
                endTime: endTime,
                element: { progressBar: progressBar, progressText: progressText, button: buildButton, card: card }
            };

            // Rulează actualizarea progresului
            updateBuildingProgress(buildingId);
        });
    });
}

function updateBuildingProgress(buildingId) {
    const item = buildingQueue[buildingId];
    if (!item) return; // Clădirea nu mai este în coadă

    const now = Date.now();
    const remainingTime = item.endTime - now;

    if (remainingTime <= 0) {
        // Construcție finalizată
        const building = buildings[buildingId];
        const currentLevel = (getUserData().buildings[buildingId] || 0) + 1; // Nivelul finalizat
        setUserBuildingLevel(buildingId, currentLevel); // Setează noul nivel
        showMessage(`"${building.name}" Nivel ${currentLevel} a fost finalizat!`, "success");

        // Actualizează producția și energia
        const productionGain = calculateProduction(building.baseProduction, currentLevel, buildingId);
        const energyConsumptionChange = calculateEnergyConsumption(building.energyConsumption, currentLevel, buildingId) - calculateEnergyConsumption(building.energyConsumption, currentLevel - 1, buildingId); // Diferența de consum

        // Aplica noul gain la resursele utilizatorului.
        // Asigură-te că `updateProduction` în `user.js` poate gestiona și "helium".
        updateProduction(productionGain.metal, productionGain.crystal, productionGain.energy - energyConsumptionChange, productionGain.helium);

        updateHUD(); // Actualizează HUD-ul după finalizarea construcției și modificarea producției

        // Curăță UI-ul
        item.element.progressBar.style.width = '100%';
        item.element.progressText.textContent = 'Finalizat!';
        item.element.button.disabled = false;
        item.element.card.classList.remove('building-in-progress'); // Elimină clasa de progres

        setTimeout(() => {
            item.element.progressBar.style.width = '0%';
            item.element.progressText.textContent = '';
            item.element.progressBar.parentNode.style.display = 'none';
            delete buildingQueue[buildingId]; // Elimină din coadă
            renderBuildings(); // Re-randare pentru a actualiza nivelul și costurile
        }, 1000); // Lasă bara de progres vizibilă pentru scurt timp
    } else {
        // În construcție
        const totalTime = item.endTime - (item.endTime - buildings[buildingId].buildTime); // Timpul total original
        const progress = ((totalTime - remainingTime) / totalTime) * 100;
        item.element.progressBar.style.width = `${progress}%`;
        item.element.progressText.textContent = `${formatTime(remainingTime / 1000)}`;

        requestAnimationFrame(() => updateBuildingProgress(buildingId));
    }
}

// Funcție pentru a actualiza barele de progres la încărcarea paginii
function updateBuildingProgressBars() {
    const now = Date.now();
    for (const buildingId in buildingQueue) {
        const item = buildingQueue[buildingId];
        const remainingTime = item.endTime - now;

        if (remainingTime > 0) {
            // Dacă încă e în construcție, reinițializează UI-ul și pornește animația
            const card = document.querySelector(`.building-card[data-id="${buildingId}"]`);
            if (card) {
                const progressBarContainer = card.querySelector('.progress-container');
                const progressBar = card.querySelector('.progress-bar');
                const progressText = card.querySelector('.progress-text');
                const buildButton = card.querySelector('.build-btn');

                if (progressBarContainer && progressBar && progressText && buildButton) {
                    progressBarContainer.style.display = 'block';
                    buildButton.disabled = true;
                    item.element = { progressBar: progressBar, progressText: progressText, button: buildButton, card: card };
                    requestAnimationFrame(() => updateBuildingProgress(buildingId));
                }
            }
        } else {
            // Dacă timpul a trecut, finalizează construcția (în cazul unei reîmprospătări de pagină)
            const building = buildings[buildingId];
            const currentLevel = (getUserData().buildings[buildingId] || 0) + 1;
            setUserBuildingLevel(buildingId, currentLevel);

            const productionGain = calculateProduction(building.baseProduction, currentLevel, buildingId);
            const energyConsumptionChange = calculateEnergyConsumption(building.energyConsumption, currentLevel, buildingId) - calculateEnergyConsumption(building.energyConsumption, currentLevel - 1, buildingId);

            updateProduction(productionGain.metal, productionGain.crystal, productionGain.energy - energyConsumptionChange, productionGain.helium);
            updateHUD();

            showMessage(`"${building.name}" Nivel ${currentLevel} a fost finalizat!`, "success");
            delete buildingQueue[buildingId];
            renderBuildings(); // Re-randare după finalizare
        }
    }
}


// Funcții helper pentru calcul costuri, producție, timp
function calculateCost(baseCost, level) {
    // Exemplu: costul crește exponențial cu nivelul
    return {
        metal: Math.floor(baseCost.metal * Math.pow(1.5, level - 1)),
        crystal: Math.floor(baseCost.crystal * Math.pow(1.5, level - 1)),
        energy: Math.floor(baseCost.energy * Math.pow(1.3, level - 1)),
        // Adaugă și costul de Heliu dacă e cazul
        helium: Math.floor((baseCost.helium || 0) * Math.pow(1.4, level - 1))
    };
}

function calculateProduction(baseProduction, level, buildingId) {
    const production = {
        metal: Math.floor(baseProduction.metal * Math.pow(1.2, level - 1)),
        crystal: Math.floor(baseProduction.crystal * Math.pow(1.2, level - 1)),
        energy: Math.floor(baseProduction.energy * Math.pow(1.2, level - 1)),
        helium: Math.floor((baseProduction.helium || 0) * Math.pow(1.15, level - 1)) // Producție pentru Heliu
    };

    // Bonus de producție specific rasei Solari
    if (getPlayerRace() === 'Solari' && buildingId === 'solarPlant') {
        production.energy = Math.floor(production.energy * 1.2); // Solari au +20% energie din centrale solare
    }
    // Adaugă bonus pentru Heliu pentru Solari
    if (getPlayerRace() === 'Solari' && buildingId === 'heliumExtractor') {
        production.helium = Math.floor(production.helium * 1.25); // Solari au +25% heliu
    }


    return production;
}

function calculateEnergyConsumption(baseConsumption, level, buildingId) {
    if (baseConsumption === 0) return 0; // Nu consumă energie

    let consumption = Math.floor(baseConsumption * Math.pow(1.1, level - 1));

    return consumption;
}

function calculateBuildTime(baseTime, level) {
    // Timpul crește liniar sau cu un factor mai mic
    return baseTime * level;
}

function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let parts = [];
    if (days > 0) parts.push(`${days}z`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`); // Afiseaza secunde chiar daca e 0 daca nu sunt alte unitati

    return parts.join(' ');
}
