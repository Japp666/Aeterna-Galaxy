console.log('research.js loaded');

function initializeResearch() {
    console.log('initializeResearch called');
    const container = document.querySelector('.research-container');
    if (!container) {
        console.error('Research container not found');
        return;
    }
    container.innerHTML = '';
    console.log('Cleared research container');

    const labLevel = gameState.buildings.research_lab || 0;
    if (!labLevel) {
        container.innerHTML = '<p>Construiește un Laborator de Cercetare pentru a începe cercetarea!</p>';
        return;
    }

    gameState.researchesList.forEach((research) => {
        const level = gameState.researches[research.key] || 0;
        if (level >= 1) return; // Cercetările sunt unice
        const canAfford = gameState.resources.research >= research.cost;
        const card = document.createElement('div');
        card.className = 'research-card';
        card.innerHTML = `
            <h3>${research.name}</h3>
            <p>Cost: ${research.cost} Cercetare</p>
            <p>Timp: ${research.time}s</p>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progress-${research.key}"></div>
                <span class="progress-timer" id="timer-${research.key}"></span>
            </div>
            <button class="research-button" data-key="${research.key}" ${canAfford && !gameState.isResearching ? '' : 'disabled'}>Cercetează</button>
        `;
        container.appendChild(card);
    });

    const buttons = document.querySelectorAll('.research-button');
    console.log(`Found ${buttons.length} research buttons`);
    buttons.forEach(button => {
        button.onclick = () => {
            console.log(`Research button clicked for key: ${button.dataset.key}`);
            if (gameState.isResearching) {
                showMessage('O cercetare este în curs!', 'error');
                return;
            }

            const key = button.dataset.key;
            const research = gameState.researchesList.find(r => r.key === key);
            if (!research) {
                console.error(`Research not found for key: ${key}`);
                return;
            }

            if (gameState.resources.research >= research.cost) {
                console.log(`Starting research: ${research.name}, Cost: ${research.cost}, Time: ${research.time}s`);
                gameState.resources.research -= research.cost;
                gameState.isResearching = true;
                buttons.forEach(btn => btn.disabled = true);
                saveGame();

                const progressBar = document.getElementById(`progress-${key}`);
                const timer = document.getElementById(`timer-${key}`);
                let timeLeft = research.time;
                progressBar.style.width = '0%';
                timer.textContent = `${timeLeft}s`;

                const interval = setInterval(() => {
                    timeLeft--;
                    const progress = ((research.time - timeLeft) / research.time) * 100;
                    progressBar.style.width = `${progress}%`;
                    timer.textContent = `${Math.floor(progress)}%`;

                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        gameState.researches[key] = 1;
                        Object.entries(research.effect).forEach(([res, multiplier]) => {
                            if (res === 'exploration') {
                                gameState.explorationUnlocked = true;
                            } else {
                                gameState.raceBonus[res] = (gameState.raceBonus[res] || 1) * multiplier;
                            }
                        });
                        gameState.isResearching = false;
                        saveGame();
                        showMessage(`${research.name} cercetată!`, 'success');
                        console.log(`Research completed: ${research.name}`);
                        initializeResearch();
                        updateHUD();
                    }
                }, 1000);
            } else {
                showMessage('Cercetare insuficientă!', 'error');
                console.log(`Insufficient research for ${research.name}: ${research.cost}, Available: ${gameState.resources.research}`);
            }
        };
    });
}
