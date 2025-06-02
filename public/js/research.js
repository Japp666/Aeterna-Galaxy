console.log('research.js loaded');

function initializeResearch() {
    console.log('initializeResearch called');
    const researchList = document.getElementById('research-list');
    if (!researchList) {
        console.error('Research list #research-list not found');
        return;
    }
    
    researchList.innerHTML = '';
    gameState.researches = gameState.researches || {};
    console.log('Cleared research list');

    gameState.researchesList.forEach(research => {
        const card = document.createElement('div');
        card.className = 'research-card';
        card.id = `research-${research.key}`;
        const level = gameState.researches[research.key] || 0;
        card.innerHTML = `
            <h3>${research.name} (Nivel: ${level})</h3>
            <p>Cost:</p>
            <p>Research: ${research.cost.research}, Metal: ${research.cost.metal}, Cristal: ${research.cost.crystal}</p>
            <p>Timp: ${research.time}s</p>
            <button class="sf-button" id="research-${research.key}">Cercetează</button>
            <div class="progress-bar" id="progress-${research.key}" style="display: none;">
                <div class="progress-fill" id="fill-${research.key}"></div>
                <span class="progress-text" id="text-${research.key}">0%</span>
            </div>
        `;
        researchList.appendChild(card);
        console.log(`Added research card for ${research.name}`);

        document.getElementById(`research-${research.key}`).addEventListener('click', () => startResearch(research.key));
    });
}

function startResearch(key) {
    console.log(`Attempting to research ${key}`);
    const research = gameState.researchesList.find(r => r.key === key);
    if (!research) {
        console.error(`Research not found: ${key}`);
        return;
    }

    const cost = research.cost;
    const hasResources = gameState.resources.research >= cost.research &&
                         gameState.resources.metal >= cost.metal &&
                         gameState.resources.crystal >= cost.crystal;
    
    if (hasResources && !gameState.isResearching) {
        gameState.isResearching = true;
        gameState.resources.research -= cost.research;
        gameState.resources.metal -= cost.metal;
        gameState.resources.crystal -= cost.crystal;
        console.log(`Researching ${research.name}, cost deducted:`, cost);

        const progressBar = document.getElementById(`progress-${key}`);
        const progressFill = document.getElementById(`fill-${key}`);
        const progressText = document.getElementById(`text-${key}`);
        const researchButton = document.getElementById(`research-${key}`);
        
        progressBar.style.display = 'block';
        researchButton.disabled = true;
        let progress = 0;
        const intervalTime = research.time * 1000 / 100;
        const interval = setInterval(() => {
            progress += 1;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, intervalTime);

        setTimeout(() => {
            gameState.researches[key] = (gameState.researches[key] || 0) + 1;
            Object.assign(gameState.raceBonus, research.effect);
            gameState.isResearching = false;
            progressBar.style.display = 'none';
            researchButton.disabled = false;
            updateHUD();
            saveGame();
            initializeResearch();
            showMessage(`Cercetare ${research.name} finalizată!`, 'success');
            console.log(`Research ${research.name} completed, effects:`, `research.effect`);
        }, research.time * 1000);
        
        updateHUD();
        saveGame();
    } else {
        showMessage(`Resurse insuficiente sau cercetare în curs pentru ${research.name}!`, 'error');
        console.warn(`Cannot research ${research.name}, cost:`, cost, 'available:', gameState.resources, 'isResearching:', gameState.isResearching);
    }
}
