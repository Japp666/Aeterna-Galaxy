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
            <img src="https://i.postimg.cc/placeholder/${building.id}.jpg" alt="${building.name}" class="error-image" onerror="this.src='https://i.postimg.cc/d07m01yM/fundal-joc.png';">
            <h3>${building.name}</h3>
            <p>Cost: ${building.cost.metal} Metal, ${building.cost.crystal} Crystal</p>
            <p>Build Time: ${building.buildTime} seconds</p>
            <button class="build-button" data-building-id="${building.id}"}">Build</button>
        `;
        buildingsContainer.appendChild(buildingCard);
    });

    const buildButtons = buildingsContainer.querySelectorAll('button.build-button');
    buildButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const buildingId = event.target.dataset.buildingId;
            const building = buildingsData.find(b => b.id === buildingId);
            const player = getPlayer();

            if (player.resources.metal >= building.cost.metal && player.resources.crystal >= building.cost.crystal) {
                try {
                    await addBuildingToQueue(buildingId, building.buildTime);
                    showMessage(`Construire ${building.name} începută!`, 'success');
                } catch (error) {
                    showMessage('Eroare la construirea clădirii!', 'error');
                }
            } else {
                showMessage('Resurse insuficiente!', 'Build');
            }
        });
    });
}
</script>
