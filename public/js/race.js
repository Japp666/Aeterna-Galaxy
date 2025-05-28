console.log('race.js loaded');

function initializeRaceSelection() {
    const raceModal = document.getElementById('race-modal');
    raceModal.className = 'modal';
    raceModal.style.display = 'block';
    const raceContainer = document.querySelector('.race-cards-container');
    const races = [
        {
            id: 'solari',
            name: 'Solari',
            description: 'Cuceritori ai stelelor, unificati prin viziune si tehnologie.',
            emblem: 'https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png'
        },
        {
            id: 'coming-soon',
            name: 'Coming Soon',
            description: 'O nouă rasă va fi dezvăluită în curând!',
            emblem: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        }
    ];
    raceContainer.innerHTML = '';
    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
            <img src="${race.emblem}" alt="${race.name}">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            ${race.id === 'solari' ? `
                <div class="race-card-buttons">
                    <button class="race-select-button" data-race="${race.id}">Selectează</button>
                    <button class="race-info-button" data-race="${race.id}">Info</button>
                </div>
            ` : ''}
        `;
        raceContainer.appendChild(card);
    });

    document.querySelectorAll('.race-select-button').forEach(button => {
        button.onclick = () => {
            gameState.player.race = 'Solari';
            raceModal.style.display = 'none';
            showMessage(`Rasa Solari aleasă!`, 'success');
            updateHUD();
        };
    });

    document.querySelectorAll('.race-info-button').forEach(button => {
        button.onclick = () => {
            showMessage('Povestea rasei Solari va fi disponibilă în curând!', 'info');
        };
    });
}
