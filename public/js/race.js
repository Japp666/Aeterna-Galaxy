console.log('race.js loaded');

function initializeRaceSelection() {
    console.log('Initializing race selection');
    const container = document.getElementById('race-selection');
    if (!container) {
        console.error('Race container missing');
        return;
    }

    container.innerHTML = '';
    const races = [
        {
            name: 'Solari',
            description: 'Advanced humans focused on technology.',
            bonus: { metal: 1.2, crystal: 1.1 },
            image: 'https://i.postimg.cc/8C2nq2zv/solari.jpg'
        },
        {
            name: 'Coming Soon',
            description: 'More races coming soon.',
            bonus: {},
            image: 'https://i.postimg.cc/4xYq4G4p/placeholder.jpg'
        }
    ];

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}" class="race-image">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            <button class="sf-button">Select</button>
        `;
        card.querySelector('button').addEventListener('click', () => {
            if (race.name !== 'Coming Soon') {
                gameState.player.race = race.name;
                gameState.raceBonus = race.bonus;
                console.log(`Selected race: ${race.name}`);
                saveGame();
                loadComponent('components/tab-home.html');
            }
        });
        container.appendChild(card);
        console.log(`Added card: ${race.name}`);
    });
}
