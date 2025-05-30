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

    const researches = gameState.researchList;
    console.log('Research array:', researches);

    researches.forEach((research, index) => {
        const level = gameState.researches[research.key] || 0;
        const cost = Object.entries(research.baseCost).reduce((acc, [resource, amount]) => {
            acc[resource] = Math.floor(amount * Math.pow(1.6, level));
            return acc;
        }, {});
        const researchTime = Math.floor(research.baseResearchTime * Math.pow(1.3, level));
        console.log(`Research: ${research.name}, Level: ${level}, Cost: ${JSON.stringify(cost)}, Time: ${researchTime}s`);

        const canAfford = Object.entries(cost).every(([resource, amount]) => gameState.resources[resource] >= amount);

        const card = document.createElement('div');
        card.className = 'research-card';
        card.innerHTML = `
            <h3>${research.name} (Nivel ${level})</h3>
            <p>Cost: ${Object.entries(cost).map(([res, amt]) => `${res}: ${amt}`).join(', ')}</p>
            <p>Timp: ${researchTime}s</p>
            <div class="progress-bar-container">
                <div class="progress-bar" id="research-progress-${index}"></div>
                <span class="progress-timer" id="research-timer-${index}"></span>
            </div>
            <button class="research-button" data-index="${index}" ${canAfford && !gameState.isResearching ? '' : 'disabled'}>Cercetează</button>
        `;
        container.appendChild(card);
        console.log(`Added card for ${research.name} at index ${index}`);
    });

    document.querySelectorAll('.research-button').forEach(button => {
        button.onclick = () => {
            if (gameState.isResearching) {
                showMessage('O cercetare este deja în curs!', 'error');
                return;
            }

            const index = parseInt(button.dataset.index);
            const research = researches[index];
            const level = gameState.researches[research.key] || 0;
            const cost = Object.entries(research.baseCost).reduce((acc, [resource, amount]) => {
                acc[resource] = Math.floor(amount * Math.pow(1.6, level));
                return acc;
            }, {});
            const researchTime = Math.floor(research.baseResearchTime * Math.pow(1.3, level));
            console.log(`Starting research: ${research.name}, Level: ${level + 1}, Time: ${researchTime}s`);

            if (Object.entries(cost).every(([resource, amount]) => gameState.resources[resource] >= amount)) {
                Object.entries(cost).forEach(([resource, amount]) => {
                    gameState.resources[resource] -= amount;
                });

                gameState.isResearching = true;
                document.querySelectorAll('.research-button').forEach(btn => btn.disabled = true);

                const progressBar = document.getElementById(`research-progress-${index}`);
                const timer = document.getElementById(`research-timer-${index}`);
                let timeLeft = researchTime;
                progressBar.style.width = '0%';
                timer.textContent = `${timeLeft}s`;

                const interval = setInterval(() => {
                    timeLeft--;
                    const progress = ((researchTime - timeLeft) / researchTime) * 100;
                    progressBar.style.width = `${progress}%`;
                    timer.textContent = `${Math.floor(progress)}%`;

                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        gameState.researches[research.key] = (gameState.researches[research.key] || 0) + 1;
                        console.log(`Completed: ${research.name}, New Level: ${gameState.researches[research.key]}`);
                        gameState.isResearching = false;
                        showMessage(`${research.name} cercetată la nivel ${gameState.researches[research.key]}!`, 'success');
                        updateHUD();
                        initializeResearch();
                    }
                }, 1000);
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        };
    });
}
