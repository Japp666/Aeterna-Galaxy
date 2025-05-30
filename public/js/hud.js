console.log('hud.js loaded');

function updateHUD() {
    const resourcesDiv = document.querySelector('.resources');
    if (!resourcesDiv) {
        console.error('Resources div not found');
        return;
    }

    const resources = [
        { id: 'metal', name: 'Metal', max: 10000 },
        { id: 'crystal', name: 'Cristal', max: 10000 },
        { id: 'helium', name: 'Heliu', max: 5000 },
        { id: 'energy', name: 'Energie', max: 5000 },
        { id: 'research', name: 'Cercetare', max: Infinity }
    ];

    resources.forEach(({ id, name, max }) => {
        const value = gameState.resources[id] || 0;
        const income = gameState.production[id] || 0;
        const element = document.getElementById(id);
        const incomeElement = document.getElementById(`${id}-income`);
        if (element) {
            element.textContent = `${name}: ${Math.floor(value)}${max !== Infinity ? `/${max}` : ''}`;
        } else {
            console.error(`Element #${id} not found`);
        }
        if (incomeElement) {
            incomeElement.textContent = `+${Math.floor(income)}/h`;
        }
    });

    const playerName = document.getElementById('player-name');
    const playerRace = document.getElementById('player-race');
    if (playerName) playerName.textContent = `Nume: ${gameState.player.nickname || 'Necunoscut'}`;
    if (playerRace) playerRace.textContent = `Rasă: ${gameState.player.race ? gameState.player.race.charAt(0).toUpperCase() + gameState.player.race.slice(1) : 'Neselectată'}`;
}
