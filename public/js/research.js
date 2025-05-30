console.log('research.js loaded');

function initializeResearch() {
    console.log('initializeResearch called');
    const container = document.querySelector('.research-container');
    if (!container) {
        console.error('Error: Research container not found');
        return;
    }
    container.innerHTML = '';

    const researchList = gameState.researchesList;
    researchList.forEach((research, index) => {
        const level = gameState.researches[research.key] || 0;
        const card = document.createElement('div');
        card.className = 'research-item';
        card.innerHTML = `
            <h3>${research.name}</h3>
            <p>Cost: ${research.cost} Cercetare</p>
            <p>Timp: ${research.time}s</p>
            <button class="research-button" data-index="${index}" ${gameState.resources.research >= research.cost && !gameState.isResearching ? '' : 'disabled'}>Cercetează</button>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.research-button').forEach(button => {
        button.onclick = () => {
            if (gameState.isResearching) {
                showMessage('O cercetare este în curs!', 'error');
                return;
            }

            const index = parseInt(button.dataset.index);
            const research = researchList[index];
            gameState.isResearching = true;
            gameState.resources.research -= research.cost;
            document.querySelectorAll('.research-button').forEach(btn => btn.disabled = true);

            let timeLeft = research.time;
            const interval = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    gameState.researches[research.key] = (gameState.researches[research.key] || 0) + 1;
                    gameState.isResearching = false;
                    showMessage(`${research.name} cercetată!`, 'success');
                    applyResearchEffects();
                    initializeResearch();
                    update();
                    HUD();
                }
            }, 1000);
        };
    });
}

function applyResearchEffects() {
    gameState.production.metal *= gameState.researches.advanced_mining ? 1.1 : 1;
    gameState.production.crystal *= gameState.researches.advanced_mining ? 1.1 : 1;
    gameState.production.helium *= gameState.researches.helium_refining ? 1.15 : 1;
}
