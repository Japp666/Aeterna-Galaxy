console.log('research.js loaded');

function initializeResearch() {
    const researchGrid = document.getElementById('research-grid');
    if (!researchGrid) {
        console.error('Research grid container not found');
        return;
    }

    const categories = {
        'Economie': ['advanced_mining', 'helium_refining'],
        'Tehnologie': ['fusion_energy', 'ionic_propulsion'],
        'Militar': ['nanotech_armor', 'galactic_exploration']
    };

    let html = '';
    for (const [category, keys] of Object.entries(categories)) {
        html += `<div class="research-category"><h2>${category}</h2><div class="research-grid">`;
        keys.forEach(key => {
            const research = gameState.researchesList.find(r => r.key === key);
            if (research) {
                const completed = gameState.researches[research.key];
                const cost = Object.entries(research.cost)
                    .map(([res, amt]) => `${res}: ${amt}`)
                    .join(', ');
                html += `
                    <div class="research-card" data-research="${research.key}">
                        <img src="https://i.postimg.cc/ydLx2C1L/coming-soon.png" alt="${research.name}">
                        <h3>${research.name}</h3>
                        <p>Cost: ${cost}</p>
                        <p>Timp: ${research.time}s</p>
                        <button class="sf-button" ${completed ? 'disabled' : ''} onclick="startResearch('${research.key}')">
                            ${completed ? 'Finalizat' : 'Cercetează'}
                        </button>
                    </div>
                `;
            }
        });
        html += `</div></div>`;
    }
    researchGrid.innerHTML = html;
}

function startResearch(researchKey) {
    const research = gameState.researchesList.find(r => r.key === researchKey);
    if (!research) return;

    if (!canAfford(research.cost)) {
        showMessage('Resurse insuficiente!', 'error');
        return;
    }
    if (gameState.isResearching) {
        showMessage('O altă cercetare este în curs!', 'error');
        return;
    }

    gameState.isResearching = true;
    deductResources(research.cost);
    saveGame();

    setTimeout(() => {
        gameState.researches[researchKey] = true;
        Object.entries(research.effect || {}).forEach(([res, value]) => {
            gameState.raceBonus[res] = (gameState.raceBonus[res] || 1) * value;
        });
        gameState.isResearching = false;
        saveGame();
        initializeResearch();
        updateHUD();
        showMessage(`${research.name} finalizat!`, 'success');
    }, research.time * 1000);
}
