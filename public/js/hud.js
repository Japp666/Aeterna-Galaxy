console.log('hud.js loaded');

function updateHUD(attempts = 0, maxAttempts = 10) {
    console.log('Updating HUD');
    const hud = document.getElementById('hud');
    if (!hud) {
        if (attempts < maxAttempts) {
            console.warn(`HUD element not found (attempt ${attempts + 1}/${maxAttempts}), retrying in 100ms`);
            setTimeout(() => updateHUD(attempts + 1, maxAttempts), 100);
        } else {
            console.error('HUD element not found after max attempts');
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

    resources.forEach(resource => {
        const element = document.getElementById(resource.id);
        if (element) {
            element.textContent = Math.floor(gameState.resources[resource.key] || 0);
        } else {
            console.warn(`Element #${resource.id} not found`);
        }
    });

    console.log('HUD updated:', gameState.resources);
}
