// js/user.js (doar secțiunile relevante)
// ...
export function setPlayerName(name) {
    userData.playerName = name;
    saveGame();
}

export function setPlayerRace(race) {
    userData.playerRace = race;
    saveGame();
}
// ...
export function updateResources(metalChange, crystalChange, energyChange, heliumChange = 0) {
    userData.resources.metal += metalChange;
    userData.resources.crystal += crystalChange;
    userData.resources.energy += energyChange;
    userData.resources.helium += heliumChange;
    saveGame();
    updateHUD();
}
// ...
