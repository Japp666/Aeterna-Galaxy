// js/research.js
import { user, saveUserData } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

export const researchData = [
    {
        id: 'advancedMining',
        name: 'Minerit Avansat',
        description: 'Îmbunătățește eficiența minelor de metal și cristal.',
        maxLevel: 5,
        cost: { metal: 500, crystal: 300, energy: 200 },
        researchTime: 30, // seconds
        effect: { metalProductionBonus: 0.1, crystalProductionBonus: 0.1 }, // 10% bonus per level
        imageUrl: 'https://i.postimg.cc/FsZ4Zz1Q/research-mining.jpg', // Placeholder, înlocuiește cu o imagine reală
        unlock: () => (user.buildings.researchCenter || 0) >= 1
    },
    {
        id: 'energyEfficiency',
        name: 'Eficiență Energetică',
        description: 'Reduce consumul de energie al clădirilor.',
        maxLevel: 3,
        cost: { metal: 400, crystal: 400, energy: 150 },
        researchTime: 45, // seconds
        effect: { energyConsumptionReduction: 0.05 }, // 5% reduction per level
        imageUrl: 'https://i.postimg.cc/Qd1n4Lg4/research-energy.jpg', // Placeholder, înlocuiește cu o imagine reală
        unlock: () => (user.buildings.researchCenter || 0) >= 2
    },
    {
        id: 'shipHullReinforcement',
        name: 'Ranforsare Cocii Navelor',
        description: 'Crește rezistența navelor de luptă.',
        maxLevel: 10,
        cost: { metal: 700, crystal: 500, energy: 300 },
        researchTime: 60, // seconds
        effect: { fleetHPBonus: 0.05 }, // 5% HP bonus per level
        imageUrl: 'https://i.postimg.cc/bwq5rT16/research-hull.jpg', // Placeholder, înlocuiește cu o imagine reală
        unlock: () => (user.buildings.researchCenter || 0) >= 3
    }
];

export function showResearch() {
    const container = document.getElementById('researchTab');
    container.innerHTML = `<h2>Cercetare</h2><div class="research-list"></div>`; // Curăță și adaugă titlul și lista

    const researchListDiv = container.querySelector('.research-list');

    researchData.forEach(tech => {
        const level = user.technologies[tech.id] || 0;
        const isUnlocked = tech.unlock();
        const nextCost = calculateResearchCost(tech, level + 1);
        const cardDiv = document.createElement('div');
        cardDiv.className = `building-card ${!isUnlocked || level >= tech.maxLevel ? 'locked' : ''}`; // Reutilizăm stilul building-card
        cardDiv.innerHTML = `
            <h3>${tech.name}</h3>
            <img src="${tech.imageUrl}" alt="${tech.name}" class="building-image">
            <p>${tech.description}</p>
            <p>Nivel: ${level} / ${tech.maxLevel}</p>
            <p>Cost cercetare: ${formatCost(nextCost)}</p>
            <button ${!isUnlocked || level >= tech.maxLevel ? 'disabled' : ''} data-research-id="${tech.id}">
                ${level >= tech.maxLevel ? 'Nivel Maxim' : 'Cercetează'}
            </button>
            <div class="progress-container">
                <div class="progress-bar" id="research-${tech.id}-bar"></div>
                <span class="progress-text" id="research-${tech.id}-text"></span>
            </div>
        `;
        if (!isUnlocked) {
            cardDiv.setAttribute('data-requirements', 'Necesită Centru Cercetare Nivel ' + tech.unlock().toString().match(/(\d+)/)[0]); // Extrage nivelul din funcția unlock
        }
        researchListDiv.appendChild(cardDiv);
    });

    document.querySelectorAll('#researchTab button').forEach(button => {
        button.addEventListener('click', (event) => {
            const techId = event.target.dataset.researchId;
            researchTechnology(techId);
        });
    });
}

function researchTechnology(id) {
    const tech = researchData.find(t => t.id === id);
    const level = user.technologies[id] || 0;

    if (level >= tech.maxLevel) {
        showMessage(`Tehnologia ${tech.name} a atins nivelul maxim.`);
        return;
    }

    const cost = calculateResearchCost(tech, level + 1);

    if (!canAfford(cost)) {
        showMessage('Nu ai suficiente resurse pentru a cerceta.');
        return;
    }

    deductResources(cost);
    updateHUD();

    const progressBar = document.getElementById(`research-${id}-bar`);
    const text = document.getElementById(`research-${id}-text`);
    if (!progressBar || !text) {
        console.error(`Elementele de progres pentru cercetare ${id} nu au fost găsite.`);
        return;
    }

    let seconds = tech.researchTime;
    progressBar.style.width = '0%';
    let elapsed = 0;

    const interval = setInterval(() => {
        elapsed++;
        const percent = Math.min((elapsed / seconds) * 100, 100);
        progressBar.style.width = `${percent}%`;
        text.textContent = `${seconds - elapsed}s`;

        if (elapsed >= seconds) {
            clearInterval(interval);
            user.technologies[id] = level + 1;
            user.score += (level + 1) * 20; // Puncte pentru cercetare
            showMessage(`Tehnologia "${tech.name}" a fost cercetată la nivelul ${user.technologies[id]}!`, 'success');
            showResearch(); // Reîncarcă tab-ul de cercetare
            updateHUD(); // Actualizează HUD-ul după cercetare
            saveUserData();
        }
    }, 1000);
}

// Funcții auxiliare (reutilizate din buildings.js, dar aici pentru claritate)
function calculateResearchCost(tech, level) {
    const factor = 1.6;
    return {
        metal: Math.floor(tech.cost.metal * Math.pow(factor, level - 1)),
        crystal: Math.floor(tech.cost.crystal * Math.pow(factor, level - 1)),
        energy: Math.floor(tech.cost.energy * Math.pow(factor, level - 1))
    };
}

function canAfford(cost) {
    return ['metal', 'crystal', 'energy'].every(
        r => user.resources[r] >= cost[r]
    );
}

function deductResources(cost) {
    ['metal', 'crystal', 'energy'].forEach(r => {
        user.resources[r] -= cost[r];
    });
}

function formatCost(cost) {
    return `M: ${cost.metal}, C: ${cost.crystal}, E: ${cost.energy}`;
}
