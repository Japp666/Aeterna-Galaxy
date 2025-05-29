console.log('race.js loaded');

function initializeRaceSelection() {
    const container = document.querySelector('.race-cards-container');
    if (!container) {
        console.error('Race cards container not found');
        return;
    }
    container.className = 'race-cards-container';
    container.innerHTML = '';

    const races = [
        {
            name: 'Solari',
            description: 'O rasă avansată tehnologic, specializată în producția de energie.',
            image: 'https://i.postimg.cc/HxYgZJ9V/solari-emblem.jpg'
        },
        {
            name: 'Coming Soon',
            description: 'Această rasă va fi disponibilă în curând!',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        }
    ];

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            <div class="race-card-buttons">
                <button class="race-select-button" data-race="${race.name}">Selectează</button>
                <button class="race-info-button" data-race="${race.name}">Info</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.race-select-button').forEach(button => {
        button.onclick = () => {
            const race = button.dataset.race;
            if (race !== 'Coming Soon') {
                gameState.player.race = race;
                showMessage(`Ai selectat rasa ${race}!`, 'success');
                updateHUD();
            } else {
                showMessage('Această rasă nu este disponibilă încă!', 'error');
            }
        };
    });

    document.querySelectorAll('.race-info-button').forEach(button => {
        button.onclick = () => {
            const race = button.dataset.race;
            showMessage(`Informații despre ${race}: ${races.find(r => r.name === race).description}`, 'success');
        };
    });
}
