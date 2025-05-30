console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const resourcesDiv = document.getElementById('hud-resources');
    if (!resourcesDiv) {
        console.error('HUD resources div not found');
        return;
    }

    resourcesDiv.innerHTML = `
        <div class="hud-resource">Metal: <span id="metal">${gameState.resources.metal}</span></div>
        <div class="hud-resource">Cristal: <span id="crystal">${gameState.resources.crystal}</span></div>
        <div class="hud-resource">Heliu: <span id="helium">${gameState.resources.helium}</span></div>
        <div class="hud-resource">Energie: <span id="energy">${gameState.resources.energy}</span></div>
    `;
}
