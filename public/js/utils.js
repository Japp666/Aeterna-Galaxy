import { setPlayerRace } from './user.js';
import { updateHUD } from './hud.js';

export function showMessage(message, type) {
    const messageContainer = document.querySelector('.message-container');
    if (!messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

export function showRaceSelectionScreen() {
    return new Promise((resolve) => {
        const raceSelectionScreen = document.getElementById('race-selection-screen');
        if (!raceSelectionScreen) {
            console.error("Elementul #race-selection-screen nu a fost găsit.");
            resolve();
            return;
        }

        const races = [
            {
                id: 'solari',
                name: 'Solari',
                description: 'O rasă avansată tehnologic, specializată în energie solară.',
                image: 'https://i.postimg.cc/d07m01yM/fundal-joc.png'
            },
            {
                id: 'coming-soon',
                name: 'Curând',
                description: 'Această rasă va fi disponibilă în curând.',
                image: 'https://i.postimg.cc/d07m01yM/fundal-joc.png',
                disabled: true
            }
        ];

        const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');
        raceCardsContainer.innerHTML = '';

        races.forEach(race => {
            const raceCard = document.createElement('div');
            raceCard.className = 'race-card';
            raceCard.innerHTML = `
                <img src="${race.image}" alt="${race.name}">
                <h3>${race.name}</h3>
                <p>${race.description}</p>
                ${race.disabled ? '<p>Indisponibil</p>' : '<button class="race-select-button" data-race-id="' + race.id + '">Selectează</button>'}
            `;
            raceCardsContainer.appendChild(raceCard);
        });

        raceSelectionScreen.style.display = 'flex';

        const selectButtons = raceCardsContainer.querySelectorAll('.race-select-button');
        selectButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const raceId = event.target.dataset.raceId;
                try {
                    await setPlayerRace(raceId);
                    raceSelectionScreen.style.display = 'none';
                    updateHUD();
                    resolve();
                } catch (error) {
                    showMessage('Eroare la selectarea rasei!', 'error');
                    resolve();
                }
            });
        });
    });
}
