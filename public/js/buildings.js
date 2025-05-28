console.log('buildings.js loaded');

function initializeBuildings() {
    const buildingsContainer = document.querySelector('.buildings-container');
    if (!buildingsContainer) {
        console.error('Buildings container not found');
        return;
    }
    buildingsContainer.innerHTML = '<div class="building-category"><h2>Clădiri</h2><div class="category-container"></div></div>';
    const container = buildingsContainer.querySelector('.category-container');

    for (const [id, data] of Object.entries(gameState.buildingsData)) {
        const level = gameState.player.buildings[id]?.level || 0;
        const card = document.createElement('div');
        card.className = 'building-card';
        card.innerHTML = `
            <img src="${data.image}" alt="${data.name}" class="building-image">
            <h3>${data.name} (Nivel ${level})</h3>
            <p>Cost: ${data.cost.metal || 0} Metal, ${data.cost.crystal || 0} Cristal, ${data.cost.helium || 0} Heliu</p>
            <p>Timp: ${data.buildTime}s</p>
            <button class="build-button" data-id="${id}">Construiește</button>
            <div class="progress-bar-container" style="display:none;">
                <div class="progress-bar"></div>
                <p class="progress-timer">0s</p>
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
    const progressContainer = card.querySelector('.progress-bar-container');
    const progressBar = card.querySelector('.progress-bar');
    const timerText = card.querySelector('.progress-timer');
    if (!progressContainer || !progressBar || !timerText) {
        console.error('Progress elements not found in card:', card);
        return;
    }
    progressContainer.style.display = 'block';
    timerText.style.display = 'block'; // Asigură vizibilitatea timerului
    let timeLeft = buildTime;
    timerText.textContent = `${timeLeft}s`;
    const interval = setInterval(() => {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;
        progressBar.style.width = `${(1 - timeLeft / buildTime) * 100}%`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            progressContainer.style.display = 'none';
            gameState.player.activeConstructions--;
            gameState.player.buildings[buildingId] = gameState.player.buildings[buildingId] || { level: 0 };
            gameState.player.buildings[buildingId].level++;
            refreshBuildingUI(buildingId);
            showMessage(`${gameState.buildingsData[buildingId].name} construit!`, 'success');
            updateBuildButtons();
        }
    }, 1000);
}

function refreshBuildingUI(buildingId) {
    const card = document.querySelector(`.build-button[data-id="${buildingId}"]`)?.closest('.building-card');
    if (card) {
        const level = gameState.player.buildings[buildingId]?.level || 0;
        card.querySelector('h3').textContent = `${gameState.buildingsData[buildingId].name} (Nivel ${level})`;
    }
}
