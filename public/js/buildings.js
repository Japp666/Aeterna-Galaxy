// js/buildings.js

import { showMessage } from './utils.js';
import { getUserData, updateResources, updateProduction, setUserBuildingLevel } from './user.js';

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
                baseProduction: { metal: 10 },
                energyConsumption: 2, // Consum pe oră
                factor: 1.5
            },
            crystalMine: {
                name: "Mina de Cristal",
                description: "Produce cristal.",
                image: "https://i.postimg.cc/qMW7VbT9/03-extractor-de-crystal-solari.jpg",
                baseCost: { metal: 150, crystal: 75, energy: 15 },
                baseProduction: { crystal: 8 },
                energyConsumption: 3,
                factor: 1.5
            },
            energyPlant: {
                name: "Centrala de Energie",
                description: "Produce energie.",
                image: "https://i.postimg.cc/G372z3S3/04-extractor-de-energie-solari.jpg",
                baseCost: { metal: 50, crystal: 100, energy: 0 },
                baseProduction: { energy: 20 },
                energyConsumption: 0, // Nu consumă energie
                factor: 1.5
            },
            heliumExtractor: {
                name: "Extractor de Heliu-2025",
                description: "Extrage heliu, o resursă rară și valoroasă.",
                image: "https://i.postimg.cc/D0Mwz5b4/02-extractor-de-heliu-2025-solari.jpg",
                baseCost: { metal: 500, crystal: 250, energy: 50 },
                baseProduction: { helium: 5 },
                energyConsumption: 10,
                factor: 1.5
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
                energyConsumption: 5,
                factor: 1.5
            }
            // Adaugă aici alte clădiri utilitare
        }
    }
};

/**
 * Calculează costul și producția pentru următorul nivel al unei clădiri.
 * @param {string} buildingId ID-ul clădirii.
 * @param {number} currentLevel Nivelul actual al clădirii.
 * @returns {object} Obiect cu costul (metal, crystal, energy) și producția (metal, crystal, energy) pentru nivelul următor.
 */
function calculateBuildingStats(buildingId, currentLevel) {
    let data;
    // Găsim clădirea în categoriile definite
    for (const category in buildingsData) {
        if (buildingsData[category].list[buildingId]) {
            data = buildingsData[category].list[buildingId];
            break;
        }
    }

    if (!data) {
        console.error(`Clădirea cu ID-ul ${buildingId} nu a fost găsită.`);
        return { cost: {}, production: {} };
    }

    const nextLevel = currentLevel + 1;
    const factor = data.factor || 1.5;

    let cost = {};
    for (const res in data.baseCost) {
        cost[res] = Math.floor(data.baseCost[res] * Math.pow(factor, currentLevel));
    }

    let production = {};
    for (const res in data.baseProduction) {
        production[res] = Math.floor(data.baseProduction[res] * nextLevel);
    }
    // Adaugăm și consumul de energie ca producție negativă
    if (data.energyConsumption) {
        production.energy = (production.energy || 0) - (data.energyConsumption * nextLevel);
    }

    return { cost, production };
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
    `;
    mainContent.appendChild(buildingsContainer);

    const userData = getUserData();

    // Iterăm prin categorii
    for (const categoryId in buildingsData) {
        const categoryInfo = buildingsData[categoryId];

        const categorySection = document.createElement('div');
        categorySection.className = 'building-category';
        categorySection.innerHTML = `<h3>${categoryInfo.categoryName}</h3><div class="building-list"></div>`;
        buildingsContainer.appendChild(categorySection);

        const buildingList = categorySection.querySelector('.building-list');

        // Iterăm prin clădirile din fiecare categorie
        for (const buildingId in categoryInfo.list) {
            const buildingInfo = categoryInfo.list[buildingId];
            const currentLevel = userData.buildings[buildingId] || 0;
            const { cost, production } = calculateBuildingStats(buildingId, currentLevel);

            const buildingElement = document.createElement('div');
            buildingElement.className = 'building-card';
            buildingElement.innerHTML = `
                <img src="${buildingInfo.image}" alt="${buildingInfo.name}" class="card-image" onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
                <h3 class="card-title">${buildingInfo.name}</h3>
                <p class="card-description">${buildingInfo.description}</p>
                <p>Nivel: <span id="${buildingId}-level">${currentLevel}</span></p>
                <p>Producție/h (nivel următor):
                    ${production.metal ? `Metal: ${production.metal}` : ''}
                    ${production.crystal ? `Cristal: ${production.crystal}` : ''}
                    ${production.energy !== undefined ? `Energie: ${production.energy}` : ''}
                    ${production.helium ? `Heliu: ${production.helium}` : ''}
                </p>
                <p>Cost nivel următor:
                    ${cost.metal ? `Metal: ${cost.metal}` : ''}
                    ${cost.crystal ? `Cristal: ${cost.crystal}` : ''}
                    ${cost.energy ? `Energie: ${cost.energy}` : ''}
                </p>
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
            const { cost } = calculateBuildingStats(buildingId, currentLevel); // Nu avem nevoie de producție aici, doar cost

            // Verifică resursele necesare
            let canBuild = true;
            for (const res in cost) {
                if (userData.resources[res] < cost[res]) {
                    canBuild = false;
                    break;
                }
            }

            if (canBuild) {
                // Deduce costul
                updateResources(-cost.metal || 0, -cost.crystal || 0, -cost.energy || 0, 0); // Adăugat 0 pentru heliu

                // Actualizează nivelul clădirii
                setUserBuildingLevel(buildingId, currentLevel + 1);

                // Recalculează producția totală a jucătorului
                recalculateTotalProduction();

                showMessage(`Ai construit ${getBuildingName(buildingId)} la nivelul ${currentLevel + 1}!`, "success");
                renderBuildings(); // Re-randare pentru a actualiza nivelurile și costurile
            } else {
                showMessage("Resurse insuficiente pentru a construi!", "error");
            }
        });
    });
}

/**
 * Recalculează producția totală a jucătorului pe baza clădirilor curente.
 * Această funcție este apelată după fiecare construcție.
 */
function recalculateTotalProduction() {
    const userData = getUserData();
    // Resetăm producția la zero
    userData.production = {
        metal: 0,
        crystal: 0,
        energy: 0,
        helium: 0
    };

    // Adăugăm producția de la fiecare clădire la nivelul ei curent
    for (const categoryId in buildingsData) {
        for (const buildingId in buildingsData[categoryId].list) {
            const currentLevel = userData.buildings[buildingId] || 0;
            if (currentLevel > 0) { // Doar dacă clădirea există și are nivel > 0
                const data = buildingsData[categoryId].list[buildingId];
                if (data) { // Verificăm dacă data clădirii există
                    // Adaugăm producția de bază înmulțită cu nivelul curent
                    for (const res in data.baseProduction) {
                        userData.production[res] = (userData.production[res] || 0) + (data.baseProduction[res] * currentLevel);
                    }
                    // Scădem consumul de energie
                    if (data.energyConsumption) {
                        userData.production.energy = (userData.production.energy || 0) - (data.energyConsumption * currentLevel);
                    }
                }
            }
        }
    }
    // Salvăm și actualizăm HUD cu noua producție
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
