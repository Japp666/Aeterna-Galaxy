console.log('research.js loaded');

function initializeResearch() {
    console.log('initializeResearch called');
    const resourcesList = document.getElementById('resources-research');
    const militaryList = document.getElementById('military-research');
    const advancedList = document.getElementById('advanced-research');
    
    if (!resourcesList || !militaryList || !advancedList) {
        console.error('Research lists not found:', {
            resourcesList: !!resourcesList,
            militaryList: !!militaryList,
            advancedList: !!advancedList
        });
        showMessage('Eroare: Listele de cercetare nu au fost găsite!', 'error');
        return;
    }

    resourcesList.innerHTML = '';
    militaryList.innerHTML = '';
    advancedList.innerHTML = '';
    gameState.researches = gameState.researches || {};
    console.log('Cleared research lists');

    const categories = {
        resources: ['advanced_mining', 'helium_refining'],
        military: ['nanotech_armor', 'ionic_propulsion'],
        advanced: ['fusion_energy', 'galactic_exploration']
    };

    gameState.researchesList.forEach(research => {
        console.log(`Processing research: ${research.name}`);
        const card = document.createElement('div');
        card.className = 'research-card';
        card.id = `research-${research.key}`;
        const level = gameState.researches[research.key] || 0;
        const cost = calculateResearchCost(research, level);
        const researchTime = calculateResearchTime(research, level);
        card.innerHTML = `
            <h3>${research.name} (Nivel: ${level})</h3>
            <p>Cost:</p>
            <p>Research: ${Math.round(cost.research)}, Metal: ${Math.round(cost.metal)}, Cristal: ${Math.round(cost.crystal)}</p>
            <p>Timp: ${Math.round(researchTime)}s</p>
            <button class="sf-button" id="research-btn-${research.key}" ${gameState.isResearching ? 'disabled' : ''}>Cercetează</button>
            <div class="progress-bar" id="progress-${research.key}" style="display: none;">
                <div class="progress-fill" id="fill-${research.key}"></div>
                <span class="progress-text" id="text-${research.key}">0%</span>
            </div>
        `;
        if (categories.resources.includes(research.key)) {
            resourcesList.appendChild(card);
            console.log(`Added ${research.name} to resources-research`);
        } else if (categories.military.includes(research.key)) {
            militaryList.appendChild(card);
            console.log(`Added ${research.name} to military-research`);
        } else if (categories.advanced.includes(research.key)) {
            advancedList.appendChild(card);
            console.log(`Added ${research.name} to advanced-research`);
        } else {
            console.warn(`Research ${research.name} not assigned to any category`);
        }

        const button = document.getElementById(`research-btn-${research.key}`);
        if (button) {
            button.addEventListener('click', () => startResearch(research.key));
            console.log(`Added click listener for ${research.name}`);
        } else {
            console.error(`Button for ${research.name} not found`);
        }
    });
}

function calculateResearchCost(research, level) {
    const cost = {};
    Object.keys(research.cost).forEach(resource => {
        cost[resource] = research.cost[resource] * Math.pow(1.4, level);
    });
    return cost;
}

function calculateResearchTime(research, level) {
    return research.time * Math.pow(1.2, level);
}

function startResearch(key) {
    console.log(`Attempting to research ${key}`);
    const research = gameState.researchesList.find(r => r.key === key);
    if (!research) {
        console.error(`Research not found: ${key}`);
        showMessage('Eroare: Cercetarea nu a fost găsită!', 'error');
        return;
    }

    const level = gameState.researches[key] || 0;
    const cost = calculateResearchCost(research, level);
    const researchTime = calculateResearchTime(research, level);
    const hasResources = gameState.resources.research >= cost.research &&
                         gameState.resources.metal >= cost.metal &&
                         gameState.resources.crystal >= cost.crystal;
    
    if (hasResources && !gameState.isResearching) {
        gameState.isResearching = true;
        gameState.resources.research -= cost.research;
        gameState.resources.metal -= cost.metal;
        gameState.resources.crystal -= cost.crystal;
        console.log(`Researching ${research.name} level ${level + 1}, cost deducted:`, cost);

        const progressBar = document.getElementById(`progress-${key}`);
        const progressFill = document.getElementById(`fill-${key}`);
        const progressText = document.getElementById(`text-${key}`);
        const researchButton = document.getElementById(`research-btn-${key}`);
        
        if (progressBar && progressFill && progressText && researchButton) {
            progressBar.style.display = 'block';
            researchButton.disabled = true;
            document.querySelectorAll('.sf-button').forEach(btn => btn.disabled = true);
            let progress = 0;
            const intervalTime = (researchTime * 1000) / 100;
            const interval = setInterval(() => {
                progress += 1;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${Math.floor(progress)}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, intervalTime);

            setTimeout(() => {
                gameState.researches[key] = level + 1;
                Object.assign(gameState.raceBonus, research.effect);
                gameState.isResearching = false;
                progressBar.style.display = 'none';
                researchButton.disabled = false;
                document.querySelectorAll('.sf-button').forEach(btn => btn.disabled = false);
                updateHUD();
                saveGame();
                initializeResearch();
                showMessage(`Cercetare ${research.name} nivel ${level + 1} finalizată!`, 'success');
                console.log(`Research ${research.name} level ${level + 1} completed, effects:`, research.effect);
            }, researchTime * 1000);
            updateHUD();
            saveGame();
        } else {
            console.error(`Progress elements for ${research.name} not found`);
            gameState.isResearching = false;
            showMessage('Eroare: Elementele de progres nu au fost găsite!', 'error');
        }
    } else {
        showMessage(`Resurse insuficiente sau cercetare în curs pentru ${research.name}!`, 'error');
        console.warn(`Cannot research ${research.name}, cost:`, cost, 'available:', gameState.resources, 'isResearching:', gameState.isResearching);
    }
}
