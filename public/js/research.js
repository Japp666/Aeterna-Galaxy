// js/research.js

import { showMessage } from './utils.js';
import { getUserData, updateResources, setUserResearchLevel } from './user.js';

// Definiția cercetărilor
const researchData = {
    advancedMining: {
        name: "Minerit Avansat",
        description: "Crește producția minelor de metal și cristal.",
        baseCost: { metal: 200, crystal: 400, energy: 100 },
        effect: "Creștere +5% producție metal și cristal pe nivel."
    },
    energyEfficiency: {
        name: "Eficiență Energetică",
        description: "Reduce consumul de energie al clădirilor.",
        baseCost: { metal: 300, crystal: 200, energy: 50 },
        effect: "Reducere -3% consum energie pe nivel."
    }
    // Adaugă alte cercetări
};

/**
 * Calculează costul pentru următorul nivel al unei cercetări.
 * @param {string} researchId ID-ul cercetării.
 * @param {number} currentLevel Nivelul actual al cercetării.
 * @returns {object} Obiect cu costul (metal, crystal, energy).
 */
function calculateResearchCost(researchId, currentLevel) {
    const data = researchData[researchId];
    const factor = 1.8; // Factor de creștere a costului
    let cost = {};
    for (const res in data.baseCost) {
        cost[res] = Math.floor(data.baseCost[res] * Math.pow(factor, currentLevel));
    }
    return cost;
}

/**
 * Randareaza interfața cercetării.
 */
export function renderResearch() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Curăță conținutul curent

    const researchContainer = document.createElement('div');
    researchContainer.className = 'research-container';
    researchContainer.innerHTML = `
        <h2>Cercetare</h2>
        <p>Investește în tehnologii noi pentru a-ți îmbunătăți imperiul.</p>
        <div class="research-list"></div>
    `;
    mainContent.appendChild(researchContainer);

    const researchList = researchContainer.querySelector('.research-list');
    const userData = getUserData();

    for (const researchId in researchData) {
        const researchInfo = researchData[researchId];
        const currentLevel = userData.research[researchId] || 0;
        const cost = calculateResearchCost(researchId, currentLevel);

        const researchElement = document.createElement('div');
        researchElement.className = 'research-card';
        researchElement.innerHTML = `
            <h3>${researchInfo.name}</h3>
            <p>${researchInfo.description}</p>
            <p>Nivel: <span id="${researchId}-level">${currentLevel}</span></p>
            <p>Efect: ${researchInfo.effect}</p>
            <p>Cost nivel următor: Metal: ${cost.metal || 0}, Cristal: ${cost.crystal || 0}, Energie: ${cost.energy || 0}</p>
            <button class="research-button" data-research-id="${researchId}">Cercetează</button>
        `;
        researchList.appendChild(researchElement);
    }

    // Adaugă event listeners pentru butoanele de cercetare
    researchList.querySelectorAll('.research-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const researchId = event.target.dataset.researchId;
            const userData = getUserData();
            const currentLevel = userData.research[researchId] || 0;
            const cost = calculateResearchCost(researchId, currentLevel);

            // Verifică resursele necesare
            let canResearch = true;
            for (const res in cost) {
                if (userData.resources[res] < cost[res]) {
                    canResearch = false;
                    break;
                }
            }

            if (canResearch) {
                // Deduce costul
                updateResources(-cost.metal || 0, -cost.crystal || 0, -cost.energy || 0);

                // Actualizează nivelul cercetării
                setUserResearchLevel(researchId, currentLevel + 1);

                // Aici ar trebui să se aplice efectele cercetării, de ex. să modifice producția
                // sau consumul clădirilor. Pentru simplitate, vom re-randa secțiunea
                // și va trebui să adaugi logica specifică de aplicare a bonusurilor
                // în funcțiile de calcul a producției/costurilor (ex: în buildings.js).
                renderResearch(); // Re-randare pentru a actualiza nivelurile și costurile
                showMessage(`Ai cercetat ${researchData[researchId].name} la nivelul ${currentLevel + 1}!`, "success");
            } else {
                showMessage("Resurse insuficiente pentru cercetare!", "error");
            }
        });
    });
}
