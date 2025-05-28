console.log('race.js loaded');

function initializeRaceSelection() {
    const raceModal = document.getElementById('race-modal');
    raceModal.className = 'modal';
    raceModal.style.display = 'block';
    const raceContainer = document.querySelector('.race-cards-container');
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
        button.onclick = () => {
            gameState.player.race = button.dataset.race;
            raceModal.style.display = 'none';
            showMessage(`Rasa ${gameState.player.race} aleasă!`, 'success');
            updateHUD();
        };
    });
}
