// js/user.js (Modificări)

// ... (partea de sus, importuri, etc.)

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
        energy: 0,
        helium: 0
    },
    buildings: {},
    research: {},
    fleet: {},
    constructionQueue: [], // <-- ADAUGAT: { buildingId: string, level: number, startTime: number, finishTime: number }
    lastUpdate: Date.now()
};

// ... (loadGame)
export function loadGame() {
    const savedData = localStorage.getItem('galacticTycoonData');
    if (savedData) {
        userData = JSON.parse(savedData);
        if (!userData.fleet) {
            userData.fleet = {};
        }
        if (!userData.constructionQueue) { // <-- Asigură-te că este inițializată
            userData.constructionQueue = [];
        }
        console.log("Game Loaded:", userData);
        calculateOfflineProduction();
    } else {
        console.log("No saved game found, starting new game.");
        userData.production = { metal: 0, crystal: 0, energy: 0, helium: 0 };
        userData.fleet = {};
        userData.constructionQueue = []; // <-- Inițializează și aici
    }
    updateHUD();
}


// ... (resetGame)
export function resetGame() {
    localStorage.removeItem('galacticTycoonData');
    userData = {
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
            energy: 0,
            helium: 0
        },
        buildings: {},
        research: {},
        fleet: {},
        constructionQueue: [], // <-- RESETEAZĂ și coada
        lastUpdate: Date.now()
    };
    saveGame();
    updateHUD();
    setupProductionInterval();
    showMessage("Jocul a fost resetat!", "info");
}

// ... (restul funcțiilor)

/**
 * Adaugă o clădire în coada de construcție.
 * @param {string} buildingId ID-ul clădirii.
 * @param {number} level Nivelul clădirii care va fi construit.
 * @param {number} duration Timpul de construcție în milisecunde.
 */
export function addBuildingToQueue(buildingId, level, duration) {
    const startTime = Date.now();
    const finishTime = startTime + duration;
    userData.constructionQueue.push({ buildingId, level, startTime, finishTime });
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
