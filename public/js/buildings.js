// js/buildings.js
import { showMessage } from './utils.js';
import { getUserData, updateResources, updateProduction, setUserBuildingLevel } from './user.js'; // Asigură-te că toate astea sunt importate

// Definiția clădirilor (exemple)
const buildingsData = {
    metalMine: {
        name: "Mina de Metal",
        description: "Produce metal.",
        baseCost: { metal: 100, crystal: 50, energy: 10 },
        baseProduction: { metal: 10, energy: -2 }, // Producție pe oră
        // factor: 1.5 // Factor de creștere a costului/producției per nivel
    },
    crystalMine: {
        name: "Mina de Cristal",
        description: "Produce cristal.",
        baseCost: { metal: 150, crystal: 75, energy: 15 },
        baseProduction: { crystal: 8, energy: -3 }
    },
    solarPlant: {
        name: "Centrala Solară",
        description: "Produce energie.",
        baseCost: { metal: 50, crystal: 100, energy: 0 },
        baseProduction: { energy: 20 }
    }
    // Adaugă și alte clădiri aici
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
    const factor = 1.5; // Exemplu de factor de creștere

    let cost = {};
    for (const res in data.baseCost) {
        cost[res] = Math.floor(data.baseCost[res] * Math.pow(factor, currentLevel));
    }

    let production = {};
    for (const res in data.baseProduction) {
        production[res] = Math.floor(data.baseProduction[res] * nextLevel); // Producție liniară cu nivelul
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
        buildingElement.className = 'building-card';
        buildingElement.innerHTML = `
            <h3>${buildingInfo.name}</h3>
            <p>${buildingInfo.description}</p>
            <p>Nivel: <span id="${buildingId}-level">${currentLevel}</span></p>
            <p>Producție/h (nivel următor): Metal: ${production.metal || 0}, Cristal: ${production.crystal || 0}, Energie: ${production.energy || 0}</p>
            <p>Cost nivel următor: Metal: ${cost.metal || 0}, Cristal: ${cost.crystal || 0}, Energie: ${cost.energy || 0}</p>
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

            if (userData.resources.metal >= cost.metal &&
                userData.resources.crystal >= cost.crystal &&
                userData.resources.energy >= cost.energy) {

                // Deduce costul
                updateResources(-cost.metal, -cost.crystal, -cost.energy);

                // Actualizează nivelul clădirii
                setUserBuildingLevel(buildingId, currentLevel + 1);

                // Actualizează producția globală (dacă e necesar)
                updateProduction(
                    (production.metal || 0) - (buildingsData[buildingId].baseProduction.metal * currentLevel || 0), // Diferența de producție
                    (production.crystal || 0) - (buildingsData[buildingId].baseProduction.crystal * currentLevel || 0),
                    (production.energy || 0) - (buildingsData[buildingId].baseProduction.energy * currentLevel || 0)
                );


                // Actualizează doar producția suplimentară pentru noul nivel
                // Aici trebuie ajustat pentru a adăuga doar producția pentru NOUA creștere a nivelului
                // O abordare mai bună ar fi să recalculezi toată producția după fiecare clădire construită.
                // Dar pentru simplitate acum, vom adăuga producția de bază a nivelului (diferența dintre noul nivel și vechiul)
                const oldProduction = calculateBuildingStats(buildingId, currentLevel -1 >= 0 ? currentLevel -1 : 0).production;
                const newProduction = calculateBuildingStats(buildingId, currentLevel + 1).production;

                const metalProdDiff = (newProduction.metal || 0) - (oldProduction.metal || 0);
                const crystalProdDiff = (newProduction.crystal || 0) - (oldProduction.crystal || 0);
                const energyProdDiff = (newProduction.energy || 0) - (oldProduction.energy || 0);

                updateProduction(metalProdDiff, crystalProdDiff, energyProdDiff);


                // Refresh UI
                document.getElementById(`${buildingId}-level`).textContent = currentLevel + 1;
                // De asemenea, ar trebui să recalculezi și să actualizezi costurile și producția afișate
                // Pentru simplitate, poți re-renda secțiunea de clădiri:
                renderBuildings();
                showMessage(`Ai construit ${buildingsData[buildingId].name} la nivelul ${currentLevel + 1}!`, "success");
            } else {
                showMessage("Resurse insuficiente pentru a construi!", "error");
            }
        });
    });
}
