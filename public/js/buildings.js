import { getPlayer, addBuildingToQueue } from './user.js';
import { showMessage } from './utils.js';

const buildingsData = [
    { id: 'power-plant', name: 'Centrală Energetică', cost: { metal: 50, crystal: 20 }, buildTime: 30, production: { energy: 10 } },
    { id: 'metal-mine', name: 'Mină de Metal', cost: { metal: 30, crystal: 10 }, buildTime: 20, production: { metal: 5 } },
    { id: 'crystal-mine', name: 'Mină de Cristal', cost: { metal: 40, crystal: 15 }, buildTime: 25, production: { crystal: 3 } }
];

export function initBuildingsPage() {
    const buildingsContainer = document.querySelector('.buildings-container');
    if (!buildingsContainer) {
        console.error("Elementul .buildings-container nu a fost găsit.");
        return;
    }
    buildingsContainer.innerHTML = '';

    buildingsData.forEach(building => {
        const buildingCard = document.createElement('div');
        buildingCard.className = 'building-card';
        buildingCard.innerHTML = `
            <img src="https://i.postimg.cc/d07m01yM/fundal-joc.png" alt="${building.name}" class="building-image">
            <h3>${building.name}</h3>
            <p>Cost: ${building.cost.metal} Metal, ${building.cost.crystal} Crystal</p>
            <p>Build Time: ${building.buildTime} seconds</p>
            <button class="build-button" data-building-id="${building.id}">Build</button>
            <div class="progress-bar-container"><div class="progress-bar" id="progress-${building.id}"></div></div>
            <div class="progress-timer" id="timer-${building.id}"></div>
        `;
        buildingsContainer.appendChild(buildingCard);
    });

    const buildButtons = buildingsContainer.querySelectorAll('.build-button');
    buildButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const buildingId = event.target.dataset.buildingId;
            const building = buildingsData.find(b => b.id === buildingId);
            const player = getPlayer();

            if (player.resources.metal >= building.cost.metal && player.resources.crystal >= building.cost.crystal) {
                try {
                    await addBuildingToQueue(buildingId, building.buildTime);
                    showMessage(`Construire ${building.name} începută!`, 'success');
                    startProgressBar(buildingId, building.buildTime);
                } catch (error) {
                    showMessage('Eroare la construirea clădirii!', 'error');
                }
            } else {
                showMessage('Resurse insuficiente!', 'error');
            }
        });
    });
}

function startProgressBar(buildingId, buildTime) {
    const progressBar = document.getElementById(`progress-${buildingId}`);
    const timerDisplay = document.getElementById(`timer-${buildingId}`);
    if (!progressBar || !timerDisplay) return;

    let progress = 0;
    let timeLeft = buildTime;
    const interval = setInterval(() => {
        progress += 100 / (buildTime * 10);
        timeLeft -= 0.1;
        if (progress >= 100) {
            progress = 100;
            timeLeft = 0;
            clearInterval(interval);
        }
        progressBar.style.width = `${progress}%`;
        timerDisplay.textContent = `Timp rămas: ${timeLeft.toFixed(1)}s`;
    }, 100);
}
