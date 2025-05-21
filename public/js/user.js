// js/user.js

// Initial user data structure
let userData = {
    name: null,
    race: null,
    resources: {
        metal: 1000,
        crystal: 500,
        energy: 100,
        helium: 0 // Adăugat noua resursă
    },
    production: {
        metal: 10,
        crystal: 5,
        energy: 1,
        helium: 0 // Adăugat noua resursă
    },
    score: 0,
    buildings: {},
    research: {},
    fleet: {}
};

// Function to load user data from Local Storage
export function getUserData() {
    const savedData = localStorage.getItem('gameUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
        // Asigură-te că noile câmpuri sunt inițializate dacă datele vechi nu le au
        if (userData.resources.helium === undefined) userData.resources.helium = 0;
        if (userData.production.helium === undefined) userData.production.helium = 0;
    }
    return userData;
}

// Function to save user data to Local Storage
function saveUserData() {
    localStorage.setItem('gameUserData', JSON.stringify(userData));
}

// Function to initialize user data (if not already present)
export function initializeUser() {
    // This function will now be called after name and race are set
    // It's primarily for ensuring default values if new fields are added later
    if (!userData.resources) { // Ar trebui să existe deja de la getUserData, dar e o verificare de siguranță
        userData.resources = { metal: 1000, crystal: 500, energy: 100, helium: 0 };
        userData.production = { metal: 10, crystal: 5, energy: 1, helium: 0 };
        userData.score = 0;
        userData.buildings = {};
        userData.research = {};
        userData.fleet = {};
        saveUserData();
    }
    // Asigură-te că noile câmpuri sunt inițializate la startul jocului, chiar dacă userul a avut date vechi
    if (userData.resources.helium === undefined) { userData.resources.helium = 0; saveUserData(); }
    if (userData.production.helium === undefined) { userData.production.helium = 0; saveUserData(); }
}

// New: Save Player Name
export function saveUserName(name) {
    userData.name = name;
    saveUserData();
}

// New: Save Player Race
export function saveUserRace(race) {
    userData.race = race;
    saveUserData();
    initializeUser();
}

// Function to update resources
// Modificat pentru a accepta și heliumChange
export function updateResources(metalChange = 0, crystalChange = 0, energyChange = 0, heliumChange = 0) {
    userData.resources.metal += metalChange;
    userData.resources.crystal += crystalChange;
    userData.resources.energy += energyChange;
    userData.resources.helium += heliumChange; // Adăugat
    saveUserData();
}

// Function to update production
// Modificat pentru a accepta și heliumProdChange
export function updateProduction(metalProdChange = 0, crystalProdChange = 0, energyProdChange = 0, heliumProdChange = 0) {
    userData.production.metal += metalProdChange;
    userData.production.crystal += crystalProdChange;
    userData.production.energy += energyProdChange;
    userData.production.helium += heliumProdChange; // Adăugat
    saveUserData();
}

// Function to update score
export function updateScore(scoreChange) {
    userData.score += scoreChange;
    saveUserData();
}

// Function to get a specific resource value
export function getResource(resourceType) {
    return userData.resources[resourceType] || 0; // Returnează 0 dacă resursa nu există
}

// Function to get a specific production value
export function getProduction(resourceType) {
    return userData.production[resourceType] || 0; // Returnează 0 dacă producția nu există
}

// Function to get current score
export function getScore() {
    return userData.score;
}

// Function to get player name
export function getPlayerName() {
    return userData.name;
}

// Function to get player race
export function getPlayerRace() {
    return userData.race;
}

// Function to get all user buildings
export function getUserBuildings() {
    return userData.buildings;
}

// Function to set user building level
export function setUserBuildingLevel(buildingId, level) {
    userData.buildings[buildingId] = level;
    saveUserData();
}

// Function to get all user research
export function getUserResearch() {
    return userData.research;
}

// Function to set user research level
export function setUserResearchLevel(researchId, level) {
    userData.research[researchId] = level;
    saveUserData();
}

// Function to get all user fleet units
export function getUserFleet() {
    return userData.fleet;
}

// Function to set user fleet unit count
export function setUserFleetUnit(unitId, count) {
    userData.fleet[unitId] = count;
    saveUserData();
}
