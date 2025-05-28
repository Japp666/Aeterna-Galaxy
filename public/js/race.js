console.log('race.js loaded successfully');
import { setPlayerRace } from './user.js';
import { showMessage } from './utils.js';

export function initializeRaceSelection() {
    console.log('Initializing race selection...');
    const raceModal = document.getElementById('race-modal');
    const raceContainer = document.querySelector('.race-cards-container');
    if (raceModal && raceContainer) {
        console.log('Race modal found, setting display to flex');
        raceModal.style.display = 'flex';
        const races = [
            { id: 'human', name: 'Oameni', description: 'Versatili și adaptabili' },
            { id: 'alien', name: 'Extratereștri', description: 'Tehnologie avansată' },
            { id: 'cyborg', name: 'Ciborgi', description: 'Putere mecanică' }
        ];
        raceContainer.innerHTML = '';
        races.forEach(race => {
            const card = document.createElement('div');
            card.className = 'race-card';
            card.innerHTML = `
                <h3>${race.name}</h3>
                <p>${race.description}</p>
                <button class="race-select-button" data-race="${race.id}">Alege</button>
            `;
            raceContainer.appendChild(card);
        });
        raceContainer.querySelectorAll('.race-select-button').forEach(button => {
            button.onclick = () => {
                const race = button.dataset.race;
                setPlayerRace(race);
                raceModal.style.display = 'none';
                showMessage(`Ai ales rasa ${race}!`, 'success');
            };
        });
    } else {
        console.error('Race modal or container not found');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('name-modal').style.display || document.getElementById('name-modal').style.display === 'none') {
        initializeRaceSelection();
    }
});
