// public/js/buildings.js - Gestionează logica clădirilor și interacțiunile cu ele

// Importăm funcțiile corecte din user.js: getPlayer (nu getUserData) și addBuildingToQueue
import { getPlayer, addBuildingToQueue } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js'; // Necesara pentru a actualiza resursele dupa constructie

// Definiția clădirilor disponibile (poți extinde cu mai multe detalii)
const buildingsData = {
    'power_plant': {
        id: 'power_plant',
        name: 'Centrală Energetică',
        description: 'Produce energie vitală pentru colonie.',
        image: 'https://i.imgur.com/example-power-plant.png', // Înlocuiește cu imagine reală
        cost: { minerals: 50, alloys: 20, energy: 0, food: 0 }, // Asigură toate resursele ca 0 dacă nu sunt folosite
        buildTime: 5 // secunde
    },
    'mineral_mine': {
        id: 'mineral_mine',
        name: 'Mină de Minerale',
        description: 'Extrage minerale din sol.',
        image: 'https://i.imgur.com/example-mineral-mine.png', // Înlocuiește cu imagine reală
        cost: { minerals: 40, energy: 10, alloys: 0, food: 0 },
        buildTime: 4 // secunde
    },
    // Adaugă aici mai multe clădiri
};

/**
 * Generează și afișează cardurile de clădiri în pagina "Clădiri".
 */
export function initBuildingsPage() {
    const player = getPlayer(); // <-- AICI ESTE CORECTIA: Folosim getPlayer()
    const buildingsContainer = document.querySelector('.buildings-container'); // Containerul principal din tab-buildings.html
    if (!buildingsContainer) {
        console.error("Elementul .buildings-container nu a fost găsit pentru pagina de clădiri.");
        return;
    }

    const buildingListElement = buildingsContainer.querySelector('.building-list');
    if (!buildingListElement) {
        // Dacă nu există un .building-list în container, crează-l
        const newList = document.createElement('div');
        newList.className = 'building-list';
        buildingsContainer.appendChild(newList);
        buildingListElement = newList;
    }

    buildingListElement.innerHTML = ''; // Curăță lista pentru a o re-popula

    Object.values(buildingsData).forEach(building => {
        const buildingCard = document.createElement('div');
        buildingCard.className = 'building-card';
        buildingCard.innerHTML = `
            <img src="${building.image}" alt="${building.name}" class="card-image">
            <h3 class="card-title">${building.name}</h3>
            <p class="card-description">${building.description}</p>
            <p>Cost: Energie: ${building.cost.energy || 0}, Minerale: ${building.cost.minerals || 0}, Aliaje: ${building.cost.alloys || 0}, Hrană: ${building.cost.food || 0}</p>
            <p>Timp de construcție: ${building.buildTime} secunde</p>
            <button class="build-button" data-building-id="${building.id}">Construiește</button>
            <div class="progress-bar-container" style="display: none;">
                <div class="progress-bar" style="width: 0%;">
                    <span class="progress-text"></span>
                </div>
            </div>
        `;
        buildingListElement.appendChild(buildingCard);
    });

    // Adaugă event listeners pentru butoanele de construcție
    buildingListElement.querySelectorAll('.build-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const buildingId = event.target.dataset.buildingId;
            const building = buildingsData[buildingId];
            if (building) {
                // Verifică dacă jucătorul are resursele necesare
                let hasResources = true;
                for (const resourceType in building.cost) {
                    if (player.resources[resourceType] === undefined || player.resources[resourceType] < building.cost[resourceType]) {
                        hasResources = false;
                        showMessage(`Nu ai suficiente ${resourceType} pentru a construi ${building.name}!`, 'error');
                        break;
                    }
                }

                if (hasResources) {
                    // Scade resursele
                    for (const resourceType in building.cost) {
                        player.resources[resourceType] -= building.cost[resourceType];
                    }
                    updateHUD(); // Actualizează HUD-ul după scăderea resurselor

                    // Adaugă clădirea în coada de construcție
                    addBuildingToQueue(buildingId, building.buildTime);
                    showMessage(`Construcția clădirii "${building.name}" a început!`, 'success');

                    // Aici poți dezactiva butonul sau afișa o bară de progres
                    event.target.disabled = true;
                    const progressBarContainer = event.target.nextElementSibling;
                    if(progressBarContainer && progressBarContainer.classList.contains('progress-bar-container')) {
                        progressBarContainer.style.display = 'block';
                        // Aici ar trebui să înceapă logica de actualizare a barei de progres pe baza timpului de construcție
                        // De exemplu, un apel la o funcție de inițializare a progresului: initBuildingProgressBar(buildingId, building.buildTime, progressBarContainer);
                    }
                }
            }
        });
    });
}
