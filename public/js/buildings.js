console.log('buildings.js loaded');

function initializeBuildings() {
    const buildingsContainer = document.querySelector('.buildings-container');
    if (!buildingsContainer) {
        console.error('Buildings container not found');
        return;
    }
    buildingsContainer.innerHTML = '<div class="building-category"><h2>Clădiri</h2><div class="category-container"></div></div>';
    const container = document.querySelector('.category-container');

    for (const [id, data] of Object.entries(gameState.buildingsData)) {
        const level = gameState.player.buildings[id]?.level || 0;
        const buttonText = (['metal-mine', 'crystal-mine', 'helium-mine', 'power-plant'].includes(id) && level > 0) ? 'Upgrade' : 'Construiește';
        const card = document.createElement('div');
        card.className = 'building-card';
        card.innerHTML = `
            <img src="${data.image}" alt="${data.name}" class="building-image">
            <h3>${data.name} (Nivel ${level})</h3>
            <p>Cost: ${data.cost.metal || 0} Metal, ${data.cost.crystal || 0} Cristal, ${data.cost.helium || 0} Heliu</p>
            <p>Timp: ${data.buildTime}s</p>
            <button class="build-button" data-id="${id}">${buttonText}</button>
            <div class="progress-bar-container" style="display:none;">
                <div class="progress-bar"></div>
                <p class="progress-timer">0%</p>
            </div>
        `;
        container.appendChild(card);
    }

    updateBuildButtons();
}

function updateBuildButtons() {
    const maxConstructions = (gameState.player.buildings['research-center']?.level || 0) + 1;
    document.querySelectorAll('.build-button').forEach(button => {
        const id = button.dataset.id;
        const data = gameState.buildingsData[id];
        const canAfford = (
            (gameState.player.resources.metal >= (data.cost.metal || 0)) &&
            (gameState.player.resources.crystal >= (data.cost.crystal || 0)) &&
            (gameState.player.resources.helium >= (data.cost.helium || 0))
        );
        const meetsRequirements = Object.entries(data.requirements).every(([reqId, reqLevel]) => {
            return (gameState.player.buildings[reqId]?.level || 0) >= reqLevel;
        });
        button.disabled = !canAfford || !meetsRequirements || gameState.player.activeConstructions >= maxConstructions;
        button.onclick = () => {
            if (canAfford && meetsRequirements) {
                gameState.player.resources.metal -= data.cost.metal || 0;
                gameState.player.resources.crystal -= data.cost.crystal || 0;
                gameState.player.resources.helium -= data.cost.helium || 0;
                gameState.player.activeConstructions++;
                showMessage(`Construiești ${data.name}!`, 'success');
                startConstructionProgress(button.closest('.building-card'), data.buildTime, id);
                updateBuildButtons();
                updateHUD();
            } else {
                showMessage('Condiții neîndeplinite sau resurse insuficiente!', 'error');
            }
        };
    });
}

function startConstructionProgress(card, buildTime, buildingId) {
    console.log(`Starting construction progress for ${buildingId}, time: ${buildTime}s`);
    const progressContainer = card.querySelector('.progress-bar-container');
    const progressBar = card.querySelector('.progress-bar');
    const progressText = card.querySelector('.progress-timer');
    if (!progressContainer || !progressBar || !progressText) {
        console.error('Progress elements not found in card:', { progressContainer, progressBar, progressText });
        return;
    }
    progressContainer.style.display = 'block';
    progressText.style.display = 'block';
    const startTime = performance.now();
    const duration = buildTime * 1000;

    function updateProgress(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const percentage = Math.floor(progress * 100);
        progressText.textContent = `${percentage}%`;
        progressBar.style.width = `${percentage}%`;
        console.log(`Progress for ${buildingId}: ${percentage}%, width: ${progressBar.style.width}`);
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            progressContainer.style.display = 'none';
            gameState.player.activeConstructions--;
            gameState.player.buildings[buildingId] = gameState.player.buildings[buildingId] || { level: 0 };
            gameState.player.buildings[buildingId].level++;
            refreshBuildingUI(buildingId);
            showMessage(`${gameState.buildingsData[buildingId].name} construit!`, 'success');
            updateBuildButtons();
            updateHUD();
        }
    }

    requestAnimationFrame(updateProgress);
}

function refreshBuildingUI(buildingId) {
    const card = document.querySelector(`.build-button[data-id="${buildingId}"]`)?.closest('.building-card');
    if (card) {
        const level = gameState.player.buildings[buildingId]?.level || 0;
        card.querySelector('h3').textContent = `${gameState.buildingsData[buildingId].name} (Nivel ${level})`;
        const button = card.querySelector('.build-button');
        if (['metal-mine', 'crystal-mine', 'helium-mine', 'power-plant'].includes(buildingId) && level > 0) {
            button.textContent = 'Upgrade';
        } else {
            button.textContent = 'Construiește';
        }
    }
}
