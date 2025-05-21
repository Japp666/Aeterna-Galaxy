// js/user.js

// Initial user data structure
let userData = {
    name: null,
    race: null,
    resources: {
        metal: 1000,
        crystal: 500,
        energy: 100
    },
    production: {
        metal: 10,
        crystal: 5,
        energy: 1
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
    if (!userData.resources) {
        userData.resources = { metal: 1000, crystal: 500, energy: 100 };
        userData.production = { metal: 10, crystal: 5, energy: 1 };
        userData.score = 0;
        userData.buildings = {};
        userData.research = {};
        userData.fleet = {};
        saveUserData();
    }
}

// New: Save Player Name
export function saveUserName(name) {
    userData.name = name;
    saveUserData();
    // Optional: Refresh HUD if name is displayed there
    // updateHUD(); // Assuming updateHUD is imported or globally available
}

// New: Save Player Race
export function saveUserRace(race) {
    userData.race = race;
    saveUserData();
    // Now that both name and race are set, we can finalize initialization if needed
    initializeUser(); // Ensures other game data is present
    // updateHUD(); // Assuming updateHUD is imported or globally available
}

// Function to update resources
export function updateResources(metalChange, crystalChange, energyChange) {
    userData.resources.metal += metalChange;
    userData.resources.crystal += crystalChange;
    userData.resources.energy += energyChange;
    saveUserData();
}

// Function to update production
export function updateProduction(metalProdChange, crystalProdChange, energyProdChange) {
    userData.production.metal += metalProdChange;
    userData.production.crystal += crystalProdChange;
    userData.production.energy += energyProdChange;
    saveUserData();
}

// Function to update score
export function updateScore(scoreChange) {
    userData.score += scoreChange;
    saveUserData();
}

// Function to get a specific resource value
export function getResource(resourceType) {
    return userData.resources[resourceType];
}

// Function to get a specific production value
export function getProduction(resourceType) {
    return userData.production[resourceType];
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
