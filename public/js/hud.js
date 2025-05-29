console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const hudContainer = document.getElementById('hud-container');
    if (!hudContainer) {
        console.error('HUD container not found');
        return;
    }

    hudContainer.innerHTML = `
        <div class="hud">
            <div class="resources">
                <div class="resource">
                    <span>Metal: ${Math.floor(gameState.resources.metal)}</span>
                    <span>(+${gameState.production.metal || 0}/h)</span>
                </div>
                <div class="resource">
                    <span>Cristal: ${Math.floor(gameState.resources.crystal)}</span>
                    <span>(+${gameState.production.crystal || 0}/h)</span>
                </div>
                <div class="resource">
                    <span>Heliu: ${Math.floor(gameState.resources.helium)}</span>
                    <span>(+${gameState.production.helium || 0}/h)</span>
                </div>
                <div class="resource">
                    <span>Energie: ${Math.floor(gameState.resources.energy)}</span>
                    <span>(+${gameState.production.energy || 0}/h)</span>
                </div>
            </div>
            <div class="player-info">
                <span>Jucător: ${gameState.player.name || 'Necunoscut'}</span>
                <span>Rasă: ${gameState.player.race || 'Neselectată'}</span>
            </div>
        </div>
    `;
}
