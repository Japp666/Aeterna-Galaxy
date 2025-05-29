console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const elements = {
        metal: document.getElementById('metal'),
        crystal: document.getElementById('crystal'),
        helium: document.getElementById('helium'),
        energy: document.getElementById('energy'),
        metalIncome: document.getElementById('metal-income'),
        crystalIncome: document.getElementById('crystal-income'),
        heliumIncome: document.getElementById('helium-income'),
        energyIncome: document.getElementById('energy-income'),
        playerName: document.getElementById('player-name'),
        playerRace: document.getElementById('player-race')
    };

    if (Object.values(elements).some(el => !el)) {
        console.error('HUD elements missing:', elements);
        console.log('Current HUD content:', document.getElementById('hud-container')?.innerHTML);
        return;
    }

    elements.metal.textContent = `Metal: ${Math.floor(gameState.player.resources.metal)}/${gameState.player.maxStorage.metal}`;
    elements.crystal.textContent = `Cristal: ${Math.floor(gameState.player.resources.crystal)}/${gameState.player.maxStorage.crystal}`;
    elements.helium.textContent = `Heliu: ${Math.floor(gameState.player.resources.helium)}/${gameState.player.maxStorage.helium}`;
    elements.energy.textContent = `Energie: ${Math.floor(gameState.player.resources.energy)}/${gameState.player.maxStorage.energy}`;
    elements.metalIncome.textContent = `+${gameState.player.incomePerHour.metal}/h`;
    elements.crystalIncome.textContent = `+${gameState.player.incomePerHour.crystal}/h`;
    elements.heliumIncome.textContent = `+${gameState.player.incomePerHour.helium}/h`;
    elements.energyIncome.textContent = `+${gameState.player.incomePerHour.energy}/h`;
    elements.playerName.textContent = `Nume: ${gameState.player.name}`;
    elements.playerRace.textContent = `Rasă: ${gameState.player.race}`;
}
