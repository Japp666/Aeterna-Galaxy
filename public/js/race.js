console.log('race.js loaded successfully');

try {
    function initializeRaceSelection() {
        console.log('Initializing race selection...');
        const raceModal = document.getElementById('race-modal');
        const raceContainer = document.querySelector('.race-cards-container');
        if (raceModal && raceContainer) {
            console.log('Race modal found, setting display to block');
            raceModal.style.display = 'block';
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

            document.querySelectorAll('.race-select-button').forEach(button => {
                button.onclick = function() {
                    const race = button.dataset.race;
                    window.setPlayerRace(race);
                    raceModal.style.display = 'none';
                    window.showMessage(`Rasa ${race} aleasă!`, 'success');
                };
            });
        } else {
            console.error('Race modal or container not found', { raceModal, raceContainer });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (!document.getElementById('name-modal')?.style.display || document.getElementById('name-modal')?.style.display === 'none') {
            initializeRaceSelection();
        }
    });
} catch (error) {
    console.error('Error in race.js:', error);
}
