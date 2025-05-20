// js/hud.js
import { user } from './user.js';
import { buildingData } from './buildings.js'; // Necesitam buildingData pentru rate de producție

export function updateHUD() {
    document.getElementById('metal').textContent = Math.floor(user.resources.metal);
    document.getElementById('crystal').textContent = Math.floor(user.resources.crystal);
    document.getElementById('energy').textContent = Math.floor(user.resources.energy);
    document.getElementById('score').textContent = user.score;

    // Actualizează producția orară
    const rates = calculateProductionRates();
    document.getElementById('prod-metal').textContent = rates.metal;
    document.getElementById('prod-crystal').textContent = rates.crystal;
    document.getElementById('prod-energy').textContent = rates.energy;
}

export function calculateProductionRates() {
    let metalRate = 0;
    let crystalRate = 0;
    let energyRate = 0;

    // Calculăm producția de la clădirile de resurse
    buildingData.resources.forEach(building => {
        const level = user.buildings[building.id] || 0;
        if (level > 0) {
            // Formula de producție crescută: baseProduction * (1 + level * 0.15)
            const production = building.baseProduction * (1 + level * 0.15);
            if (building.id === 'metalMine') {
                metalRate += production;
            } else if (building.id === 'crystalMine') {
                crystalRate += production;
            } else if (building.id === 'energyPlant') {
                energyRate += production;
            }
        }
    });

    // Aici poți adăuga logica pentru consumul de energie
    // De exemplu, clădirile de producție consumă energie?
    // Deocamdată, doar adunăm producția

    return {
        metal: Math.floor(metalRate),
        crystal: Math.floor(crystalRate),
        energy: Math.floor(energyRate)
    };
}

export function startProductionInterval() {
    setInterval(() => {
        const rates = calculateProductionRates();
        user.resources.metal += rates.metal / 3600; // Resurse pe secundă
        user.resources.crystal += rates.crystal / 3600;
        user.resources.energy += rates.energy / 3600;
        updateHUD();
        // saveUserData(); // Salvarea se face acum la 60 secunde în main.js
    }, 1000); // Actualizează la fiecare secundă
}
