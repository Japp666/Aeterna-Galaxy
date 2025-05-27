import { getPlayer, getProductionPerHour } from './user.js';

let lastHUDState = null;

export function updateHUD() {
    console.log('Updating HUD...');
    const player = getPlayer();
    const production = getProductionPerHour();
    const playerInfo = document.getElementById('player-info');
    const resources = document.getElementById('resources');

    if (!playerInfo || !resources) {
        console.error("Elementele HUD nu au fost găsite.");
        return;
    }

    const currentState = JSON.stringify({
        name: player.name,
        race: player.race,
        resources: player.resources,
        production
    });

    if (currentState === lastHUDState) {
        return;
    }

    lastHUDState = currentState;

    playerInfo.innerHTML = `
        <span id="player-name">${player.name || 'Unknown'}</span> | 
        <span id="player-race">${player.race || 'No Race'}</span>
    `;
    resources.innerHTML = `
        <span id="resource-metal">${Math.floor(player.resources.metal)}</span> Metal (+${Math.floor(production.metal)}/h) | 
        <span id="resource-crystal">${Math.floor(player.resources.crystal)}</span> Cristal (+${Math.floor(production.crystal)}/h) | 
        <span id="resource-energy">${Math.floor(player.resources.energy)}</span> Energie (+${Math.floor(production.energy)}/h) | 
        <span id="resource-helium">${Math.floor(player.resources.helium)}</span> Heliu (+${Math.floor(production.helium)}/h)
    `;
}
