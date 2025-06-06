console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const elements = {
        metal: document.getElementById('metal'),
        metalIncome: document.getElementById('metal-amount'),
        crystal: document.getElementById('crystal'),
        crystalIncome: document.getElementById('crystal-amount'),
        helium: document.getElementById('helium'),
        heliumIncome: document.getElementById('helium-amount'),
        energy: document.getElementById('energy'),
        energyIncome: document.getElementById('energy-amount'),
        playerName: document.getElementById('player-name'),
        playerRace: document.getElementById('player-race'),
        playerCoords: document.getElementById('player-coords')
    };

    if (Object.values(elements).some(el => !el)) {
        console.warn('Some HUD elements are missing, skipping update');
        return;
    }

    elements.metal.textContent = `Metal: ${Math.floor(gameState.resources.metal)}/100000`;
    elements.metalIncome.textContent = `+${Math.floor(gameState.production.metal * (gameState.raceBonus.metal || 1))}/h`;
    elements.crystal.textContent = `Cristal: ${Math.floor(gameState.resources.crystal)}/100000`;
    elements.crystalIncome.textContent = `+${Math.floor(gameState.production.crystal * (gameState.raceBonus.crystal || 1))}/h`;
    elements.helium.textContent = `Heliu: ${Math.floor(gameState.resources.helium)}/50000`;
    elements.heliumIncome.textContent = `+${Math.floor(gameState.production.helium * (gameState.raceBonus.helium || 1))}/h`;
    elements.energy.textContent = `Energie: ${Math.floor(gameState.resources.energy)}/50000`;
    elements.energyIncome.textContent = `+${Math.floor(gameState.production.energy * (gameState.raceBonus.energy || 1))}/h`;
    elements.playerName.textContent = `Nume: ${gameState.player.nickname || 'Necunoscut'}`;
    elements.playerRace.textContent = `Rasă: ${gameState.player.race || 'Neselectată'}`;
    elements.playerCoords.textContent = `Coordonate: (${gameState.player.coords.x || 0}, ${gameState.player.coords.y || 0})`;
}
</xaiAgentArtifact>

**Modificări**:
- Am adăugat un obiect `elements` pentru a verifica toate elementele necesare.
- Dacă vreun element lipsește, `updateHUD` se oprește pentru a preveni erorile.
- Am actualizat ID-urile pentru `metal-income`, `crystal-income` etc. pentru a fi consistente cu `hud.html`.

---

#### **5. Actualizez `hud.html`**
Corectăm ID-ul și să fie compatibil cu `updateHUD`

<xaiArtifact artifact_id="e210f8d1-7374-4403-ba12-55017aafcc75" artifact_version_id="a853db51-2d7b-43d7-83ab-0c3bc26d2c39" title="hud.html" contentType="text/html">
<div class="hud">
    <div class="resources">
        <div class="resource-item">
            <span id="metal">Metal: 0/100000</span>
            <span id="metal-amount">+0/h</span>
        </div>
        <div class="resource-item">
            <span id="crystal">Cristal: 0/100000</span>
            <span id="crystal-amount">+0/h</span>
        </div>
        <div class="resource-item">
            <span id="helium">Heliu: 0/50000</span>
            <span id="helium-amount">+0/h</span>
        </div>
        <div class="resource-item">
            <span id="energy">Energie: 0/50000</span>
            <span id="energy-amount">+0/h</span>
        </div>
    </div>
    <div id="player-info">
        <span id="player-name">Nume: Necunoscut</span>
        <span id="player-race">Rasă: Neselectată</span>
        <span id="player-coords">Coordonate: (0, 0)</span>
    </div>
</div>
