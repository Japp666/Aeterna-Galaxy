// public/js/buildings.js

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

// Obiect pentru a stoca intervalele de actualizare a barelor de progres
const buildingProgressIntervals = {};

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
    if (!mainContent) {
        console.error("Elementul #main-content nu a fost găsit pentru randarea clădirilor.");
        return;
    }
    // mainContent.innerHTML = ''; // Nu curățăm mainContent aici, deoarece tab-buildings.html este deja încărcat în el

    const buildingsContainer = mainContent.querySelector('.buildings-container'); // Selectează containerul existent
    if (!buildingsContainer) {
        // Dacă nu există, înseamnă că tab-buildings.html nu a fost încărcat corect sau structura e diferită
        console.error("Elementul .buildings-container nu a fost găsit în #main-content.");
        return;
    }
    buildingsContainer.innerHTML = ''; // Curăță conținutul existent pentru a evita duplicarea la re-randare

    const userData = getUserData();
    const constructionQueue = getConstructionQueue();

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

            // Verifică dacă această clădire este deja în construcție (următorul nivel)
            const inConstruction = constructionQueue.find(item => item.buildingId === buildingId && item.level === currentLevel + 1);
            // console.log(`Clădire ${buildingId} Nivel ${currentLevel + 1} în construcție:`, inConstruction);


            const buildingElement = document.createElement('div');
            buildingElement.className = 'building-card';
            buildingElement.id = `building-card-${buildingId}`; // ID pentru a identifica cardul
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
                <button class="build-button" data-building-id="${buildingId}" ${inConstruction ? 'disabled' : ''}>${inConstruction ? 'În Construcție' : 'Construiește'}</button>
                <div id="progress-container-${buildingId}" class="progress-bar-container" style="display: ${inConstruction ? 'block' : 'none'};">
                    <div class="progress-bar" id="progress-bar-${buildingId}" style="width: 0%;">
                        <span class="progress-text" id="progress-text-${buildingId}"></span>
                    </div>
                </div>
            `;
            buildingList.appendChild(buildingElement);

            // Inițializează bara de progres dacă clădirea este deja în construcție
            if (inConstruction) {
                setupBuildingProgressBar(buildingId, inConstruction);
            }
        }
    }

    // Adaugă event listeners pentru butoanele de construcție
    buildingsContainer.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const buildingId = event.target.dataset.buildingId;
            const userData = getUserData();
            const currentLevel = userData.buildings[buildingId] || 0;
            const { cost, buildTime } = calculateBuildingStats(buildingId, currentLevel);

            const constructionQueue = getConstructionQueue();
            // Verifică dacă coada de construcție nu este plină (ex: max 1 element la un moment dat)
            if (constructionQueue.length >= 1) {
                showMessage("Coada de construcție este plină! Așteaptă să se finalizeze construcția curentă.", "error");
                return;
            }
            // Verifică dacă această clădire (următorul nivel) este deja în construcție
            if (constructionQueue.find(item => item.buildingId === buildingId && item.level === currentLevel + 1)) {
                 return; // Butonul ar trebui să fie deja disabled, dar este o verificare de siguranță
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
                const constructionItem = { buildingId, level: currentLevel + 1, startTime: Date.now(), finishTime: Date.now() + buildTime };
                addBuildingToQueue(constructionItem);

                // Actualizează starea butonului și afișează bara de progres
                event.target.disabled = true;
                event.target.textContent = 'În Construcție';
                const progressBarContainer = document.getElementById(`progress-container-${buildingId}`);
                if(progressBarContainer) { // Verificare suplimentară dacă elementul există
                    progressBarContainer.style.display = 'block';
                }

                setupBuildingProgressBar(buildingId, constructionItem); // Inițializează bara de progres

                showMessage(`Construcția "${getBuildingName(buildingId)}" (nivel ${currentLevel + 1}) a început!`, "success");

            } else {
                showMessage("Resurse insuficiente pentru a construi!", "error");
            }
        });
    });

    // Reinițializarea barelor de progres pentru construcțiile existente la randare
    const queue = getConstructionQueue();
    queue.forEach(item => {
        const buildingCard = document.getElementById(`building-card-${item.buildingId}`);
        if (buildingCard) {
            const buildButton = buildingCard.querySelector('.build-button');
            if (buildButton) {
                buildButton.disabled = true;
                buildButton.textContent = 'În Construcție';
            }
            const progressBarContainer = document.getElementById(`progress-container-${item.buildingId}`);
            if (progressBarContainer) {
                progressBarContainer.style.display = 'block';
            }
            setupBuildingProgressBar(item.buildingId, item);
        }
    });
}

/**
 * Configurează și actualizează bara de progres pentru o clădire specifică.
 * @param {string} buildingId ID-ul clădirii.
 * @param {object} constructionItem Obiectul construcției din coadă.
 */
function setupBuildingProgressBar(buildingId, constructionItem) {
    // Curăță orice interval existent pentru această clădire
    if (buildingProgressIntervals[buildingId]) {
        clearInterval(buildingProgressIntervals[buildingId]);
    }

    const progressBar = document.getElementById(`progress-bar-${buildingId}`);
    const progressText = document.getElementById(`progress-text-${buildingId}`);
    // buildButton nu este necesar aici, se va actualiza la finishConstruction
    const totalTime = constructionItem.finishTime - constructionItem.startTime;

    if (!progressBar || !progressText) {
        console.error(`Elementele pentru bara de progres a clădirii ${buildingId} nu au fost găsite.`);
        return;
    }

    buildingProgressIntervals[buildingId] = setInterval(() => {
        let timeLeft = constructionItem.finishTime - Date.now();
        timeLeft = Math.max(0, timeLeft); // Asigură că timpul rămas nu este negativ

        const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100;

        progressBar.style.width = `${progress}%`;
        progressText.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(buildingProgressIntervals[buildingId]);
            delete buildingProgressIntervals[buildingId]; // Elimină intervalul

            // Găsește indexul corect în coadă, deoarece coada se poate schimba
            const queue = getConstructionQueue();
            const index = queue.findIndex(item =>
                item.buildingId === buildingId &&
                item.level === constructionItem.level &&
                item.startTime === constructionItem.startTime
            );

            if (index !== -1) {
                finishConstruction(constructionItem, index);
            }
        }
    }, 1000); // Actualizează la fiecare secundă
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
    setUserBuildingLevel(item.buildingId, item.level); // Setează nivelul clădirii
    removeBuildingFromQueue(index); // Elimină din coadă
    recalculateTotalProduction(); // Recalculează producția
    showMessage(`Construcția "${getBuildingName(item.buildingId)}" (nivel ${item.level}) a fost finalizată!`, "success");

    // Resetează vizual cardul clădirii
    const buildButton = document.querySelector(`.build-button[data-building-id="${item.buildingId}"]`);
    if (buildButton) {
        buildButton.disabled = false;
        buildButton.textContent = 'Construiește';
    }
    const progressBarContainer = document.getElementById(`progress-container-${item.buildingId}`);
    if (progressBarContainer) {
        progressBarContainer.style.display = 'none';
        const progressBar = document.getElementById(`progress-bar-${item.buildingId}`);
        if(progressBar) progressBar.style.width = '0%';
        const progressText = document.getElementById(`progress-text-${item.buildingId}`);
        if(progressText) progressText.textContent = '';
    }
    // Actualizează nivelul afișat al clădirii
    const levelSpan = document.getElementById(`${item.buildingId}-level`);
    if (levelSpan) {
        levelSpan.textContent = item.level;
    }
}

/**
 * Recalculează producția totală a jucătorului pe baza clădirilor curente.
 * Această funcție este apelată după fiecare construcție finalizată.
 */
export function recalculateTotalProduction() { // Exportată pentru a fi apelată și din exterior dacă e necesar
    const userData = getUserData();
    userData.production = { // Resetează producția înainte de a o recalcula
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

// Logică de inițializare a barelor de progres la încărcarea paginii
// Mutată în renderBuildings pentru a fi apelată corect la încărcarea dinamică a tab-ului
