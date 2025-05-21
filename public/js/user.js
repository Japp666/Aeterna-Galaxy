// js/user.js
import { showMessage } from './utils.js'; // Asigură-te că showMessage este importat
import { updateHUD } from './hud.js'; // Asigură-te că updateHUD este importat

// Structura inițială a datelor utilizatorului
let userData = {
    playerName: null,
    playerRace: null,
    resources: {
        metal: 500,
        crystal: 200,
        energy: 100,
        helium: 0 // Adaugă heliului la resurse
    },
    production: { // Producție pe oră
        metal: 0,
        crystal: 0,
        energy: 0,
        helium: 0
    },
    buildings: {
        // Exemplu: metalMine: 1, solarPlant: 1
    },
    research: {
        // Exemplu: advancedMining: 1
    },
    lastUpdate: Date.now() // Timpul ultimei actualizări/salvări
};

/**
 * Încarcă datele jocului din localStorage.
 */
export function loadGame() {
    const savedData = localStorage.getItem('spaceGameData');
    if (savedData) {
        userData = JSON.parse(savedData);
        // Asigură-te că noile proprietăți sunt inițializate dacă lipsesc din salvarea veche
        if (typeof userData.resources.helium === 'undefined') userData.resources.helium = 0;
        if (typeof userData.production.helium === 'undefined') userData.production.helium = 0;

        // Calculează resursele acumulate offline
        const now = Date.now();
        const timeElapsed = (now - userData.lastUpdate) / (1000 * 60 * 60); // Diferența în ore

        if (timeElapsed > 0) {
            let metalGained = Math.floor(userData.production.metal * timeElapsed);
            let crystalGained = Math.floor(userData.production.crystal * timeElapsed);
            let energyGained = Math.floor(userData.production.energy * timeElapsed);
            let heliumGained = Math.floor(userData.production.helium * timeElapsed); // Heliu

            // Asigură-te că energia nu depășește maximul sau nu scade sub 0 dacă consumul e mare
            // Această logică ar trebui să fie mai complexă pentru a simula consumul real.
            // Deocamdată, doar adăugăm resursele fără a verifica supra-consumul.
            userData.resources.metal += metalGained;
            userData.resources.crystal += crystalGained;
            userData.resources.energy += energyGained;
            userData.resources.helium += heliumGained; // Adaugă Heliu

            showMessage(`Ai acumulat ${metalGained} Metal, ${crystalGained} Cristal, ${energyGained} Energie, ${heliumGained} Heliu offline!`, "info");
        }

        userData.lastUpdate = now; // Actualizează timpul ultimei salvări
        saveGame(); // Salvează imediat după încărcare pentru a actualiza lastUpdate
    }
    console.log("Game Loaded:", userData);
    updateHUD(); // Actualizează HUD-ul după încărcare
}

/**
 * Salvează datele jocului în localStorage.
 */
export function saveGame() {
    userData.lastUpdate = Date.now(); // Actualizează timpul înainte de salvare
    localStorage.setItem('spaceGameData', JSON.stringify(userData));
    console.log("Game Saved:", userData);
}

/**
 * Returnează toate datele utilizatorului.
 * @returns {object} Obiectul cu datele utilizatorului.
 */
export function getUserData() {
    return userData;
}

/**
 * Actualizează resursele utilizatorului.
 * @param {number} metalChange Cantitatea de metal de adăugat/scăzut.
 * @param {number} crystalChange Cantitatea de cristal de adăugat/scăzut.
 * @param {number} energyChange Cantitatea de energie de adăugat/scăzut.
 * @param {number} heliumChange Cantitatea de heliu de adăugat/scament.
 */
export function updateResources(metalChange, crystalChange, energyChange, heliumChange = 0) {
    userData.resources.metal += metalChange;
    userData.resources.crystal += crystalChange;
    userData.resources.energy += energyChange;
    userData.resources.helium += heliumChange; // Actualizează heliului
    saveGame();
    updateHUD();
}

/**
 * Actualizează producția de resurse pe oră.
 * @param {number} metalProdChange Schimbarea producției de metal.
 * @param {number} crystalProdChange Schimbarea producției de cristal.
 * @param {number} energyProdChange Schimbarea producției de energie.
 * @param {number} heliumProdChange Schimbarea producției de heliu.
 */
export function updateProduction(metalProdChange, crystalProdChange, energyProdChange, heliumProdChange = 0) {
    userData.production.metal += metalProdChange;
    userData.production.crystal += crystalProdChange;
    userData.production.energy += energyProdChange;
    userData.production.helium += heliumProdChange; // Actualizează producția de heliu
    saveGame();
    updateHUD();
}

/**
 * Setează nivelul unei clădiri.
 * @param {string} buildingId ID-ul clădirii.
 * @param {number} level Noul nivel al clădirii.
 */
export function setUserBuildingLevel(buildingId, level) {
    userData.buildings[buildingId] = level;
    saveGame();
}

/**
 * Setează nivelul unei cercetări.
 * @param {string} researchId ID-ul cercetării.
 * @param {number} level Noul nivel al cercetării.
 */
export function setUserResearchLevel(researchId, level) {
    userData.research[researchId] = level;
    saveGame();
}

/**
 * Returnează rasa curentă a jucătorului.
 * @returns {string|null} Rasa jucătorului.
 */
export function getPlayerRace() {
    return userData.playerRace;
}

/**
 * Setează rasa jucătorului.
 * @param {string} race Rasa selectată.
 */
export function setPlayerRace(race) {
    userData.playerRace = race;
    saveGame();
}

/**
 * Resetarea completă a jocului (pentru debugging/testare).
 */
export function resetGame() {
    localStorage.removeItem('spaceGameData');
    userData = {
        playerName: null,
        playerRace: null,
        resources: {
            metal: 500,
            crystal: 200,
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
        lastUpdate: Date.now()
    };
    updateHUD();
    showMessage("Jocul a fost resetat!", "info");
    // Forțează reafișarea modalului de nume
    window.location.reload(); // Reîncărcăm pagina pentru a arăta modalul
}

// Acum, exporturile sunt clare și explicite.
