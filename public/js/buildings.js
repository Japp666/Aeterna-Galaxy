// js/buildings.js

import { showMessage } from './utils.js';
import { getUserData, updateResources, updateProduction, setUserBuildingLevel } from './user.js';

// Definiția clădirilor cu căi de imagine corecte
const buildingsData = {
    metalMine: {
        name: "Mina de Metal",
        description: "Produce metal.",
        image: "/public/img/solari/01-extractor-de-metal-solari.jpg", // Calea corectă!
        baseCost: { metal: 100, crystal: 50, energy: 10 },
        baseProduction: { metal: 10, energy: -2 },
        factor: 1.5
    },
    crystalMine: {
        name: "Mina de Cristal",
        description: "Produce cristal.",
        image: "/public/img/solari/03-extractor-de-crystal-solari.jpg", // Calea corectă!
        baseCost: { metal: 150, crystal: 75, energy: 15 },
        baseProduction: { crystal: 8, energy: -3 },
        factor: 1.5
    },
    energyPlant: { // Re-numit pentru claritate, "solarPlant" e OK, dar acum e "energyPlant"
        name: "Centrala de Energie",
        description: "Produce energie.",
        image: "/public/img/solari/04-extractor-de-energie-solari.jpg", // Calea corectă!
        baseCost: { metal: 50, crystal: 100, energy: 0 },
        baseProduction: { energy: 20 },
        factor: 1.5
    },
    heliumExtractor: { // Adăugat pentru heliu
        name: "Extractor de Heliu-2025",
        description: "Extrage heliu, o resursă rară și valoroasă.",
        image: "/public/img/solari/02-extractor-de-heliu-2025-solari.jpg", // Calea corectă!
        baseCost: { metal: 500, crystal: 250, energy: 50 },
        baseProduction: { helium: 5, energy: -10 },
        factor: 1.5
    },
    researchLab: { // Centrul de cercetare
        name: "Centru de Cercetare",
        description: "Permite dezvoltarea de noi tehnologii.",
        image: "/public/img/solari/05-centru-de-cercetare-solari.jpg", // Calea corectă!
        baseCost: { metal: 300, crystal: 600, energy: 100 },
        baseProduction: { /* Nu produce resurse, dar e necesar pentru cercetare */ },
        factor: 1.5
    }
};

/**
 * Calculează costul și producția pentru următorul nivel al unei clădiri.
 * @param {string} buildingId ID-ul clădirii.
 * @param {number} currentLevel Nivelul actual al clădirii.
 * @returns {object} Obiect cu costul (metal, crystal, energy) și producția (metal, crystal, energy).
 */
function calculateBuildingStats(buildingId, currentLevel) {
    const data = buildingsData[buildingId];
    const nextLevel = currentLevel + 1;
    const factor = data.factor || 1.5; // Folosește factorul definit în data

    let cost = {};
    for (const res in data.baseCost) {
        cost[res] = Math.floor(data.baseCost[res] * Math.pow(factor, currentLevel));
    }

    let production = {};
    for (const res in data.baseProduction) {
        // Dacă e un minus, va fi consum
        production[res] = Math.floor(data.baseProduction[res] * nextLevel);
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
        <div class="building-list"></div>
    `;
    mainContent.appendChild(buildingsContainer);

    const buildingList = buildingsContainer.querySelector('.building-list');
    const userData = getUserData();

    for (const buildingId in buildingsData) {
        const buildingInfo = buildingsData[buildingId];
        const currentLevel = userData.buildings[buildingId] || 0;
        const { cost, production } = calculateBuildingStats(buildingId, currentLevel);

        const buildingElement = document.createElement('div');
        buildingElement.className = 'building-card'; // Folosim aceleași stiluri ca la rase pentru consistență
        buildingElement.innerHTML = `
            <img src="${buildingInfo.image}" alt="${buildingInfo.name}" onerror="this.onerror=null;this.src='/public/img/placeholder.png';">
            <h3>${buildingInfo.name}</h3>
            <p>${buildingInfo.description}</p>
            <p>Nivel: <span id="${buildingId}-level">${currentLevel}</span></p>
            <p>Producție/h (nivel următor):
                ${production.metal ? `Metal: ${production.metal}` : ''}
                ${production.crystal ? `Cristal: ${production.crystal}` : ''}
                ${production.energy ? `Energie: ${production.energy}` : ''}
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

    // Adaugă event listeners pentru butoanele de construcție
    buildingList.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const buildingId = event.target.dataset.buildingId;
            const userData = getUserData();
            const currentLevel = userData.buildings[buildingId] || 0;
            const { cost, production } = calculateBuildingStats(buildingId, currentLevel);

            // Verifică resursele necesare
            let canBuild = true;
            for (const res in cost) {
                if (userData.resources[res] < cost[res]) {
                    canBuild = false;
                    break;
                }
            }

            if (canBuild) {
                // Deduce costul și actualizează resursele
                for (const res in cost) {
                    userData.resources[res] -= cost[res];
                }
                updateResources(0, 0, 0, 0); // Trigger updateResources pentru a salva și a actualiza HUD

                // Actualizează nivelul clădirii
                setUserBuildingLevel(buildingId, currentLevel + 1);

                // Recalculează producția totală și o aplică
                // O abordare mai sigură este să recalculezi toată producția după fiecare modificare
                recalculateTotalProduction();

                showMessage(`Ai construit ${buildingsData[buildingId].name} la nivelul ${currentLevel + 1}!`, "success");
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
    for (const buildingId in userData.buildings) {
        const currentLevel = userData.buildings[buildingId];
        if (currentLevel > 0) { // Doar dacă clădirea există
            const data = buildingsData[buildingId];
            if (data && data.baseProduction) {
                 for (const res in data.baseProduction) {
                    userData.production[res] += Math.floor(data.baseProduction[res] * currentLevel);
                }
            }
        }
    }
    updateProduction(0, 0, 0, 0); // Salvează și actualizează HUD cu noua producție
}

// Asigură-te că funcția de recalculare este apelabilă din exterior dacă e nevoie
// export { recalculateTotalProduction }; // Poate nu e necesar dacă e apelată intern
