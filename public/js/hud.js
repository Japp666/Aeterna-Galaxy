console.log('hud.js loaded');

function updateHUD(attempts = 0, maxAttempts = 10) {
    console.log('Updating HUD');
    const hud = document.getElementById('hud');
    if (!hud) {
        if (attempts < maxAttempts) {
            console.warn(`HUD missing (attempt ${attempts + 1})`);
            setTimeout(() => updateHUD(attempts + 1), 100);
        } else {
            console.error('HUD not found');
        }
        return;
    }

    const resources = [
        { id: 'metal', key: 'metal' },
        { id: 'crystal', key: 'crystal' },
        { id: 'helium', key: 'helium' },
        { id: 'energy', key: 'energy' },
        { id: 'research', key: 'research' }
    ];

    resources.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = Math.floor(gameState.resources[key] || 0);
        } else {
            console.warn(`Element #${id} missing`);
        }
    });
    console.log('HUD updated:', gameState.resources);
}
