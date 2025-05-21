// public/js/user.js - Gestionează datele jucătorului și salvarea/încărcarea

import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

let userData = {
    playerName: '',
    playerRace: '',
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
    fleet: {}, // { unitId: quantity, ... }
    constructionQueue: [], // { buildingId: string, level: number, startTime: number, finishTime: number }
    lastUpdate: Date.now() // Timpul ultimului update pentru calcul offline
};

/**
 * Încărcă datele jocului din localStorage.
 */
export function loadGame() {
    const savedData = localStorage.getItem('galacticTycoonData');
    if (savedData) {
        userData = JSON.parse(savedData);
        // Asigură-te că proprietățile noi există la încărcare
        if (!userData.fleet) userData.fleet = {};
        if (!userData.constructionQueue) userData.constructionQueue = [];
        if (!userData.production) userData.production = { metal: 0, crystal: 0, energy: 0, helium: 0 };
        // Asigură-te că resursele au valori numerice (uneori pot fi stringuri din localStorage)
        for (const res in userData.resources) {
            userData.resources[res] = parseFloat(userData.resources[res] || 0);
        }
        for (const res in userData.production) {
            userData.production[res] = parseFloat(userData.production[res] || 0);
        }

        console.log("Game Loaded:", userData);
        calculateOfflineProduction();
    } else {
        console.log("No saved game found, starting new game.");
        // Resetăm la valorile inițiale dacă nu există salvare
        userData = {
            playerName: '',
            playerRace: '',
            score: 0,
            resources: { metal: 500, crystal: 250, energy: 100, helium: 0 },
            production: { metal: 0, crystal: 0, energy: 0, helium: 0 },
            buildings: {},
            research: {},
            fleet: {},
            constructionQueue: [],
            lastUpdate: Date.now()
        };
    }
}

/**
 * Salvează datele jocului în localStorage.
 */
export function saveGame() {
    userData.lastUpdate = Date.now(); // Actualizează timpul ultimei salvări
    localStorage.setItem('galacticTycoonData', JSON.stringify(userData));
    // console.log("Game Saved:", userData);
}

/**
 * Calculează resursele produse offline.
 */
function calculateOfflineProduction() {
    const now = Date.now();
    const timeElapsed = now - userData.lastUpdate; // Timp în milisecunde
    const secondsElapsed = timeElapsed / 1000; // Timp în secunde

    // Nu calcula producție offline dacă a trecut mai puțin de 1 secundă
    if (secondsElapsed < 1) {
        return;
    }

    if (secondsElapsed > 0) {
        const metalGained = userData.production.metal * secondsElapsed;
        const crystalGained = userData.production.crystal * secondsElapsed;
        let energyGained = userData.production.energy * secondsElapsed;
        const heliumGained = userData.production.helium * secondsElapsed;

        userData.resources.metal += metalGained;
        userData.resources.crystal += crystalGained;
        userData.resources.energy += energyGained;
        userData.resources.helium += heliumGained;

        // Asigură-te că resursele nu devin negative (cu excepția energiei care poate fi negativă)
        userData.resources.metal = Math.max(0, userData.resources.metal);
        userData.resources.crystal = Math.max(0, userData.resources.crystal);
        userData.resources.helium = Math.max(0, userData.resources.helium);

        // Mesajul offline să fie afișat doar dacă s-a produs ceva semnificativ
        const totalGained = metalGained + crystalGained + Math.abs(energyGained) + heliumGained;
        if (totalGained > 0.1) { // Afișează mesajul doar dacă s-a produs ceva notabil
            showMessage(`Ai produs offline: M: ${Math.floor(metalGained)}, C: ${Math.floor(crystalGained)}, E: ${Math.floor(energyGained)}, H: ${Math.floor(heliumGained)}.`, "info");
        }
    }
}

/**
 * Resetează jocul la starea inițială.
 */
export function resetGame() {
    localStorage.removeItem('galacticTycoonData');
    userData = {
        playerName: '',
        playerRace: '',
        score: 0,
        resources: { metal: 500, crystal: 250, energy: 100, helium: 0 },
        production: { metal: 0, crystal: 0, energy: 0, helium: 0 },
        buildings: {},
        research: {},
        fleet: {},
        constructionQueue: [],
        lastUpdate: Date.now()
    };
    saveGame();
    updateHUD();
    // Reinițializarea intervalului de producție se face de către main.js
    // Reîncărcarea paginii ar fi cea mai sigură metodă după un reset complet
    window.location.reload();
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
    // console.log("Updating production in HUD:", userData.production);
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
export function setUserFleetUnit(unitId, quantity) {
    userData.fleet[unitId] = quantity;
    saveGame();
}

/**
 * Adaugă o clădire în coada de construcție.
 * @param {object} item Obiectul construcției: { buildingId: string, level: number, startTime: number, finishTime: number }
 */
export function addBuildingToQueue(item) {
    userData.constructionQueue.push(item);
    saveGame();
}

/**
 * Returnează coada de construcție curentă.
 * @returns {Array} Coada de construcție.
 */
export function getConstructionQueue() {
    return userData.constructionQueue;
}

/**
 * Elimină o clădire din coada de construcție (după finalizare).
 * @param {number} index Indexul elementului în coada.
 */
export function removeBuildingFromQueue(index) {
    userData.constructionQueue.splice(index, 1);
    saveGame();
}
