import { getPlayer } from './user.js';

let lastHUDState = null;

export function updateHUD() {
    console.log('Updating HUD...');
    const player = getPlayer();
    const playerInfo = document.getElementById('player-info');
    const resources = document.getElementById('resources');

    if (!playerInfo || !resources) {
        console.error("Elementele HUD nu au fost găsite.");
        return;
    }

    const currentState = JSON.stringify({
        name: player.name,
        race: player.race,
        resources: player.resources
    });

    if (currentState === lastHUDState) {
        return; // Evită actualizarea inutilă
    }

    lastHUDState = currentState;

    playerInfo.innerHTML = `
        <span id="player-name">${player.name || 'Unknown'}</span> | 
        <span id="player-race">${player.race || 'No Race'}</span>
    `;
    resources.innerHTML = `
        <span id="resource-metal">${Math.floor(player.resources.metal)}</span> Metal | 
        <span id="resource-crystal">${Math.floor(player.resources.crystal)}</span> Cristal | 
        <span id="resource-energy">${Math.floor(player.resources.energy)}</span> Energie | 
        <span id="resource-helium">${Math.floor(player.resources.helium)}</span> Heliu
    `;
}
