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
        helium: 0
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
    fleet: { // Adăugăm o secțiune pentru flotă
        fighter: 0,
        cruiser: 0,
        battleship: 0,
        colonyShip: 0,
        recycler: 0,
        spyProbe: 0
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
        if (typeof userData.fleet === 'undefined') {
            userData.fleet = {
                fighter: 0,
                cruiser: 0,
                battleship: 0,
                colonyShip: 0,
                recycler: 0,
                spyProbe: 0
            };
        }

        // Calculează resursele acumulate offline
        const now = Date.now();
        const timeElapsed = (now - userData.lastUpdate) / (1000 * 60 * 60); // Diferența în ore

        if (timeElapsed > 0) {
            let metalGained = Math.floor(userData.production.metal * timeElapsed);
            let crystalGained = Math.floor(userData.production.crystal * timeElapsed);
            let energyGained = Math.floor(userData.production.energy * timeElapsed);
            let heliumGained = Math.floor(userData.production.helium * timeElapsed);

            userData.resources.metal += metalGained;
            userData.resources.crystal += crystalGained;
            userData.resources.energy += energyGained;
            userData.resources.helium += heliumGained;

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
 * Returnează numele jucătorului.
 * @returns {string|null} Numele jucătorului.
 */
export function getPlayerName() {
    return userData.playerName;
}

/**
 * Returnează rasa curentă a jucătorului.
 * @returns {string|null} Rasa jucătorului.
 */
export function getPlayerRace() {
    return userData.playerRace;
}

/**
 * Setează numele jucătorului.
 * @param {string} name Numele selectat.
 */
export function setPlayerName(name) {
    userData.playerName = name;
    saveGame();
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
 * Actualizează resursele utilizatorului.
 * @param {number} metalChange Cantitatea de metal de adăugat/scăzut.
 * @param {number} crystalChange Cantitatea de cristal de adăugat/scăzut.
 * @param {number} energyChange Cantitatea de energie de adăugat/scăzut.
 * @param {number} heliumChange Cantitatea de heliu de adăugat/scăzut.
 */
export function updateResources(metalChange, crystalChange, energyChange, heliumChange = 0) {
    userData.resources.metal += metalChange;
    userData.resources.crystal += crystalChange;
    userData.resources.energy += energyChange;
    userData.resources.helium += heliumChange;
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
    userData.production.helium += heliumProdChange;
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
 * Setează numărul de unități pentru un anumit tip de navă în flotă.
 * @param {string} unitType Tipul unității (e.g., 'fighter', 'cruiser').
 * @param {number} count Numărul de unități.
 */
export function setUserFleetUnit(unitType, count) {
    if (userData.fleet.hasOwnProperty(unitType)) {
        userData.fleet[unitType] = count;
        saveGame();
    } else {
        console.warn(`Tip de unitate flotă necunoscut: ${unitType}`);
    }
}

/**
 * Returnează numărul de unități pentru un anumit tip de navă din flotă.
 * @param {string} unitType Tipul unității (e.g., 'fighter', 'cruiser').
 * @returns {number} Numărul de unități.
 */
export function getUserFleetUnit(unitType) {
    return userData.fleet[unitType] || 0;
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
        fleet: {
            fighter: 0,
            cruiser: 0,
            battleship: 0,
            colonyShip: 0,
            recycler: 0,
            spyProbe: 0
        },
        lastUpdate: Date.now()
    };
    updateHUD();
    showMessage("Jocul a fost resetat!", "info");
    window.location.reload(); // Reîncarcăm pagina pentru a arăta modalul
}
