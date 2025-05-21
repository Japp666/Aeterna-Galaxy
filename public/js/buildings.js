// js/buildings.js (Modificări)

import { showMessage } from './utils.js';
import { getUserData, updateResources, updateProduction, setUserBuildingLevel, addBuildingToQueue, getConstructionQueue, removeBuildingFromQueue } from './user.js';

// Definiția clădirilor cu căi de imagine corecte și factori de creștere
const buildingsData = {
    production: {
        categoryName: "Clădiri de Producție",
        list: {
            metalMine: {
                name: "Mina de Metal",
                description: "Produce metal.",
                image: "https://i.postimg.cc/wT1BrKSX/01-extractor-de-metal-solari.jpg",
                baseCost: { metal: 100, crystal: 50, energy: 10 },
                baseProduction: { metal: 10 / 3600 }, // Producție pe secundă
                energyConsumption: 2 / 3600, // Consum pe secundă
                factor: 1.5,
                buildTime: 10 * 1000 // 10 secunde pentru nivelul 1 (milisecunde)
            },
            crystalMine: {
                name: "Mina de Cristal",
                description: "Produce cristal.",
                image: "https://i.postimg.cc/qMW7VbT9/03-extractor-de-crystal-solari.jpg",
                baseCost: { metal: 150, crystal: 75, energy: 15 },
                baseProduction: { crystal: 8 / 3600 },
                energyConsumption: 3 / 3600,
                factor: 1.5,
                buildTime: 12 * 1000 // 12 secunde
            },
            energyPlant: {
                name: "Centrala de Energie",
                description: "Produce energie.",
                image: "https://i.postimg.cc/G372z3S3/04-extractor-de-energie-solari.jpg",
                baseCost: { metal: 50, crystal: 100, energy: 0 },
                baseProduction: { energy: 20 / 3600 },
                energyConsumption: 0,
                factor: 1.5,
                buildTime: 8 * 1000 // 8 secunde
            },
            heliumExtractor: {
                name: "Extractor de Heliu-2025",
                description: "Extrage heliu, o resursă rară și valoroasă.",
                image: "https://i.postimg.cc/D0Mwz5b4/02-extractor-de-heliu-2025-solari.jpg",
                baseCost: { metal: 500, crystal: 250, energy: 50 },
                baseProduction: { helium: 5 / 3600 },
                energyConsumption: 10 / 3600,
                factor: 1.5,
                buildTime: 15 * 1000 // 15 secunde
            }
        }
    },
    utility: {
        categoryName: "Clădiri Utilitare",
        list: {
            researchLab: {
                name: "Centru de Cercetare",
                description: "Permite dezvoltarea de noi tehnologii.",
                image: "https://i.postimg.cc/7PFRFdhv/05-centru-de-cercetare-solari.jpg",
                baseCost: { metal: 300, crystal: 600, energy: 100 },
                baseProduction: { /* Nu produce resurse direct */ },
                energyConsumption: 5 / 3600,
                factor: 1.5,
                buildTime: 20 * 1000 // 20 secunde
            }
        }
    }
};

/**
 * Calculează costul și producția pentru următorul nivel al unei clădiri.
 * @param {string} buildingId ID-ul clădirii.
 * @param {number} currentLevel Nivelul actual al clădirii.
 * @returns {object} Obiect cu costul (metal, crystal, energy), producția (metal, crystal, energy) și timpul de construcție.
 */
function calculateBuildingStats(buildingId, currentLevel) {
    let data;
    for (const category in buildingsData) {
        if (buildingsData[category].list[buildingId]) {
            data = buildingsData[category].list[buildingId];
            break;
        }
    }

    if (!data) {
        console.error(`Clădirea cu ID-ul ${buildingId} nu a fost găsită.`);
        return { cost: {}, production: {}, buildTime: 0 };
    }

    const nextLevel = currentLevel + 1;
    const factor = data.factor || 1.5; // Factor de creștere cost

    let cost = {};
    for (const res in data.baseCost) {
        cost[res] = Math.floor(data.baseCost[res] * Math.pow(factor, currentLevel));
    }

    let production = {};
    for (const res in data.baseProduction) {
        production[res] = data.baseProduction[res] * nextLevel; // Producție per secundă
    }
    if (data.energyConsumption !== undefined) { // Verifică explicit pentru 0
        production.energy = (production.energy || 0) - (data.energyConsumption * nextLevel);
    }

    // Timpul de construcție crește și el cu nivelul
    const buildTime = Math.floor(data.buildTime * Math.pow(factor, currentLevel)); // Timp în milisecunde

    return { cost, production, buildTime };
}


/**
 * Randareaza interfața clădirilor.
 */
export function renderBuildings() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Curăță conținutul curent

    const buildingsContainer = document.createElement('div');
    buildingsContainer.className = 'buildings-container';
    buildingsContainer.innerHTML = `
        <h2>Clădirile tale</h2>
        <p>Construiește noi clădiri pentru a-ți crește producția și capacitatea.</p>
        <div id="construction-queue-display"></div>
    `;
    mainContent.appendChild(buildingsContainer);

    // Afișează coada de construcție
    displayConstructionQueue();

    const userData = getUserData();

    for (const categoryId in buildingsData) {
        const categoryInfo = buildingsData[categoryId];
        const categorySection = document.createElement('div');
        categorySection.className = 'building-category';
        categorySection.innerHTML = `<h3>${categoryInfo.categoryName}</h3><div class="building-list"></div>`;
        buildingsContainer.appendChild(categorySection);

        const buildingList = categorySection.querySelector('.building-list');

        for (const buildingId in categoryInfo.list) {
            const buildingInfo = categoryInfo.list[buildingId];
            const currentLevel = userData.buildings[buildingId] || 0;
            const { cost, production, buildTime } = calculateBuildingStats(buildingId, currentLevel);

            const buildingElement = document.createElement('div');
            buildingElement.className = 'building-card';
            buildingElement.innerHTML = `
                <img src="${buildingInfo.image}" alt="${buildingInfo.name}" class="card-image" onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
                <h3 class="card-title">${buildingInfo.name}</h3>
                <p class="card-description">${buildingInfo.description}</p>
                <p>Nivel: <span id="${buildingId}-level">${currentLevel}</span></p>
                <p>Producție/h (nivel următor):
                    ${production.metal ? `Metal: ${Math.floor(production.metal * 3600)}` : ''}
                    ${production.crystal ? `Cristal: ${Math.floor(production.crystal * 3600)}` : ''}
                    ${production.energy !== undefined ? `Energie: ${Math.floor(production.energy * 3600)}` : ''}
                    ${production.helium ? `Heliu: ${Math.floor(production.helium * 3600)}` : ''}
                </p>
                <p>Cost nivel următor:
                    ${cost.metal ? `Metal: ${cost.metal}` : ''}
                    ${cost.crystal ? `Cristal: ${cost.crystal}` : ''}
                    ${cost.energy ? `Energie: ${cost.energy}` : ''}
                </p>
                <p>Timp construcție: ${formatTime(buildTime)}</p>
                <button class="build-button" data-building-id="${buildingId}">Construiește</button>
            `;
            buildingList.appendChild(buildingElement);
        }
    }

    // Adaugă event listeners pentru butoanele de construcție
    buildingsContainer.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const buildingId = event.target.dataset.buildingId;
            const userData = getUserData();
            const currentLevel = userData.buildings[buildingId] || 0;
            const { cost, buildTime } = calculateBuildingStats(buildingId, currentLevel);

            // Verifică dacă coada de construcție nu este plină (ex: max 1 element)
            if (getConstructionQueue().length >= 1) { // Poți seta o limită mai mare aici
                showMessage("Coada de construcție este plină! Așteaptă să se finalizeze construcția curentă.", "error");
                return;
            }

            // Verifică resursele necesare
            let canBuild = true;
            for (const res in cost) {
                if (userData.resources[res] < cost[res]) {
                    canBuild = false;
                    break;
                }
            }

            if (canBuild) {
                // Deduce costul imediat
                updateResources(-cost.metal || 0, -cost.crystal || 0, -cost.energy || 0, 0);

                // Adaugă clădirea în coada de construcție
                addBuildingToQueue(buildingId, currentLevel + 1, buildTime);

                showMessage(`Construcția "${getBuildingName(buildingId)}" (nivel ${currentLevel + 1}) a început!`, "success");
                renderBuildings(); // Re-randare pentru a actualiza display-ul (și coada)
            } else {
                showMessage("Resurse insuficiente pentru a construi!", "error");
            }
        });
    });
}

/**
 * Afișează și actualizează coada de construcție.
 */
function displayConstructionQueue() {
    const queueDisplay = document.getElementById('construction-queue-display');
    if (!queueDisplay) return;

    const queue = getConstructionQueue();
    queueDisplay.innerHTML = ''; // Curăță display-ul

    if (queue.length === 0) {
        queueDisplay.innerHTML = '<p>Coada de construcție este goală.</p>';
        return;
    }

    queue.forEach((item, index) => {
        const buildingName = getBuildingName(item.buildingId);
        const totalTime = item.finishTime - item.startTime;
        let timeLeft = item.finishTime - Date.now();

        // Asigură-te că timpul rămas nu este negativ
        timeLeft = Math.max(0, timeLeft);

        const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100;

        const queueItemDiv = document.createElement('div');
        queueItemDiv.className = 'construction-queue-item';
        queueItemDiv.innerHTML = `
            <p>${buildingName} (Nivel ${item.level}) în construcție...</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%;">
                    <span class="progress-text">${formatTime(timeLeft)}</span>
                </div>
            </div>
        `;
        queueDisplay.appendChild(queueItemDiv);

        // Actualizează bara de progres în fiecare secundă
        const progressInterval = setInterval(() => {
            timeLeft = item.finishTime - Date.now();
            timeLeft = Math.max(0, timeLeft);
            const currentProgress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100;

            const progressBar = queueItemDiv.querySelector('.progress-bar');
            const progressText = queueItemDiv.querySelector('.progress-text');

            if (progressBar && progressText) {
                progressBar.style.width = `${currentProgress}%`;
                progressText.textContent = formatTime(timeLeft);
            }

            if (timeLeft <= 0) {
                clearInterval(progressInterval);
                // Finalizează construcția
                finishConstruction(item, index);
            }
        }, 1000); // Actualizează la fiecare secundă
    });
}

/**
 * Formatează timpul în minute și secunde.
 * @param {number} ms Timpul în milisecunde.
 * @returns {string} Timpul formatat.
 */
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Finalizează o construcție când timpul a expirat.
 * @param {object} item Obiectul construcției din coadă.
 * @param {number} index Indexul elementului în coadă.
 */
function finishConstruction(item, index) {
    const userData = getUserData();
    setUserBuildingLevel(item.buildingId, item.level); // Setează nivelul clădirii
    removeBuildingFromQueue(index); // Elimină din coadă
    recalculateTotalProduction(); // Recalculează producția
    showMessage(`Construcția "${getBuildingName(item.buildingId)}" (nivel ${item.level}) a fost finalizată!`, "success");
    renderBuildings(); // Re-randare pentru a actualiza lista de clădiri și coada
}

/**
 * Recalculează producția totală a jucătorului pe baza clădirilor curente.
 * Această funcție este apelată după fiecare construcție finalizată.
 */
function recalculateTotalProduction() {
    const userData = getUserData();
    userData.production = {
        metal: 0,
        crystal: 0,
        energy: 0,
        helium: 0
    };

    for (const categoryId in buildingsData) {
        for (const buildingId in buildingsData[categoryId].list) {
            const currentLevel = userData.buildings[buildingId] || 0;
            if (currentLevel > 0) {
                const data = buildingsData[categoryId].list[buildingId];
                if (data) {
                    for (const res in data.baseProduction) {
                        userData.production[res] = (userData.production[res] || 0) + (data.baseProduction[res] * currentLevel);
                    }
                    if (data.energyConsumption !== undefined) {
                        userData.production.energy = (userData.production.energy || 0) - (data.energyConsumption * currentLevel);
                    }
                }
            }
        }
    }
    updateProduction(0, 0, 0, 0); // Parametrii sunt 0 pentru că am modificat direct userData.production
}

/**
 * Helper function to get building name by ID.
 * @param {string} buildingId
 * @returns {string}
 */
function getBuildingName(buildingId) {
    for (const categoryId in buildingsData) {
        if (buildingsData[categoryId].list[buildingId]) {
            return buildingsData[categoryId].list[buildingId].name;
        }
    }
    return buildingId; // Fallback
}
