// js/user.js

import { updateHUD, setupProductionInterval } from './hud.js';
import { showMessage } from './utils.js';

let userData = {
    playerName: '',
    playerRace: '', // Adăugăm rasa jucătorului
    score: 0,
    resources: {
        metal: 500,
        crystal: 250,
        energy: 100,
        helium: 0
    },
    production: {
        metal: 0,
        crystal: 0,
        energy: 0, // Energia poate fi negativă dacă consumul e mai mare decât producția
        helium: 0
    },
    buildings: {}, // { buildingId: level, ... }
    research: {}, // { researchId: level, ... }
    fleet: {}, // { unitId: quantity, ... } <-- ADAUGAT AICI
    lastUpdate: Date.now() // Timpul ultimului update pentru calcul offline
};

/**
 * Încărcă datele jocului din localStorage.
 */
export function loadGame() {
    const savedData = localStorage.getItem('galacticTycoonData');
    if (savedData) {
        userData = JSON.parse(savedData);
        // Asigură-te că `fleet` există, dacă nu, inițializează-l
        if (!userData.fleet) {
            userData.fleet = {};
        }
        console.log("Game Loaded:", userData);
        // Recalculează producția offline dacă jocul a fost închis
        calculateOfflineProduction();
    } else {
        console.log("No saved game found, starting new game.");
        // Dacă nu există salvare, asigură-te că producția este 0 inițial
        // și fleet este gol
        userData.production = { metal: 0, crystal: 0, energy: 0, helium: 0 };
        userData.fleet = {}; // Inițializează fleet
    }
    updateHUD(); // Actualizează HUD-ul imediat după încărcare
}

/**
 * Salvează datele jocului în localStorage.
 */
export function saveGame() {
    userData.lastUpdate = Date.now(); // Actualizează timpul ultimei salvări
    localStorage.setItem('galacticTycoonData', JSON.stringify(userData));
    console.log("Game Saved:", userData);
}

/**
 * Calculează resursele produse offline.
 */
function calculateOfflineProduction() {
    const now = Date.now();
    const timeElapsed = now - userData.lastUpdate; // Timp în milisecunde
    const hoursElapsed = timeElapsed / (1000 * 60 * 60); // Timp în ore

    if (hoursElapsed > 0) {
        const metalGained = userData.production.metal * hoursElapsed;
        const crystalGained = userData.production.crystal * hoursElapsed;
        let energyGained = userData.production.energy * hoursElapsed;
        const heliumGained = userData.production.helium * hoursElapsed;

        // Asigură-te că energia nu scade sub 0 din cauza consumului excesiv offline
        if (userData.production.energy < 0 && userData.resources.energy + energyGained < 0) {
            energyGained = -userData.resources.energy; // Doar cât să ajungă la 0
        }

        userData.resources.metal += metalGained;
        userData.resources.crystal += crystalGained;
        userData.resources.energy += energyGained;
        userData.resources.helium += heliumGained;

        showMessage(`Ai produs offline: ${Math.floor(metalGained)} Metal, ${Math.floor(crystalGained)} Cristal, ${Math.floor(energyGained)} Energie, ${Math.floor(heliumGained)} Heliu.`, "info");
    }
}


/**
 * Resetează jocul la starea inițială.
 */
export function resetGame() {
    localStorage.removeItem('galacticTycoonData');
    userData = {
        playerName: '',
        playerRace: '', // Resetăm și rasa
        score: 0,
        resources: {
            metal: 500,
            crystal: 250,
            energy: 100,
            helium: 0
        },
        production: {
            metal: 0,
            crystal: 0,
            energy: 0,
            helium: 0
        },
        buildings: {},
        research: {},
        fleet: {}, // Resetăm și flota
        lastUpdate: Date.now()
    };
    saveGame();
    updateHUD();
    setupProductionInterval(); // Restartează intervalul de producție
    showMessage("Jocul a fost resetat!", "info");
}

/**
 * Returnează toate datele jucătorului.
 * @returns {object} Obiectul cu datele jucătorului.
 */
export function getUserData() {
    return userData;
}

/**
 * Returnează numele jucătorului.
 * @returns {string} Numele jucătorului.
 */
export function getPlayerName() {
    return userData.playerName;
}

/**
 * Setează numele jucătorului.
 * @param {string} name Noul nume al jucătorului.
 */
export function setPlayerName(name) {
    userData.playerName = name;
    updateHUD();
    saveGame();
}

/**
 * Returnează rasa jucătorului.
 * @returns {string} Rasa jucătorului.
 */
export function getPlayerRace() {
    return userData.playerRace;
}

/**
 * Setează rasa jucătorului.
 * @param {string} race Noul nume al rasei.
 */
export function setPlayerRace(race) {
    userData.playerRace = race;
    updateHUD();
    saveGame();
}

/**
 * Actualizează resursele jucătorului.
 * @param {number} metal Cantitatea de metal de adăugat/scăzut.
 * @param {number} crystal Cantitatea de cristal de adăugat/scăzut.
 * @param {number} energy Cantitatea de energie de adăugat/scăzut.
 * @param {number} helium Cantitatea de heliu de adăugat/scăzut.
 */
export function updateResources(metal, crystal, energy, helium) {
    userData.resources.metal += metal;
    userData.resources.crystal += crystal;
    userData.resources.energy += energy;
    userData.resources.energy = Math.max(0, userData.resources.energy); // Asigură că energia nu devine negativă aici
    userData.resources.helium += helium;

    // Asigură-te că celelalte resurse nu sunt negative
    userData.resources.metal = Math.max(0, userData.resources.metal);
    userData.resources.crystal = Math.max(0, userData.resources.crystal);
    userData.resources.helium = Math.max(0, userData.resources.helium);

    updateHUD();
    saveGame();
}

/**
 * Actualizează producția jucătorului.
 * Această funcție este chemată de `recalculateTotalProduction` din `buildings.js`
 * după ce a fost recalculată total.
 * @param {number} metalProd Producția totală de metal.
 * @param {number} crystalProd Producția totală de cristal.
 * @param {number} energyProd Producția totală de energie.
 * @param {number} heliumProd Producția totală de heliu.
 */
export function updateProduction(metalProd, crystalProd, energyProd, heliumProd) {
    // Producția totală este gestionată direct în userData.production de către buildings.js
    // Această funcție doar declanșează actualizarea HUD-ului și salvarea.
    updateHUD();
    saveGame();
}

/**
 * Setează nivelul unei clădiri și salvează jocul.
 * @param {string} buildingId ID-ul clădirii.
 * @param {number} level Nivelul clădirii.
 */
export function setUserBuildingLevel(buildingId, level) {
    userData.buildings[buildingId] = level;
    saveGame();
}

/**
 * Setează nivelul unei cercetări și salvează jocul.
 * @param {string} researchId ID-ul cercetării.
 * @param {number} level Nivelul cercetării.
 */
export function setUserResearchLevel(researchId, level) {
    userData.research[researchId] = level;
    saveGame();
}

/**
 * Setează sau actualizează cantitatea unei unități de flotă și salvează jocul.
 * @param {string} unitId ID-ul unității de flotă.
 * @param {number} quantity Cantitatea unității.
 */
export function setUserFleetUnit(unitId, quantity) { // <-- NOUĂ FUNCȚIE ADAUGATĂ ȘI EXPORTATĂ
    userData.fleet[unitId] = quantity;
    saveGame();
}
