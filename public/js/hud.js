console.log('hud.js loaded');

function updateHUD() {
    console.log('Updating HUD');
    const elements = {
        budget: document.getElementById('budget'),
        energy: document.getElementById('energy'),
        coachName: document.getElementById('coach-name'),
        clubName: document.getElementById('club-name'),
        standing: document.getElementById('standing'),
        gameDate: document.getElementById('game-date')
    };

    if (Object.values(elements).some(el => !el)) {
        console.warn('Some HUD elements are missing, skipping update');
        return;
    }

    elements.budget.textContent = `Bani: ${Math.floor(gameState.club.budget).toLocaleString()} €`;
    elements.energy.textContent = `Energie: ${Math.floor(gameState.club.energy)}/1000`;
    elements.coachName.textContent = `Antrenor: ${gameState.coach.name || 'Necunoscut'}`;
    elements.clubName.textContent = `Club: ${gameState.club.name || 'Necunoscut'}`;
    elements.standing.textContent = `Clasament: Loc ${gameState.league.standings.find(s => s.team === gameState.club.name)?.position || 'N/A'}/12`;
    elements.gameDate.textContent = `Data: ${gameState.gameDate instanceof Date ? gameState.gameDate.toLocaleDateString('ro-RO') : 'N/A'}`;
}
