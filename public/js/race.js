console.log('race.js loaded');

function initializeRaceSelection() {
    console.log('initializeRaceSelection called');
    const container = document.getElementById('race-selection');
    if (!container) {
        console.error('Race selection container not found');
        return;
    }

    container.innerHTML = '';
    console.log('Cleared race-selection container');

    const races = [
        {
            name: 'Solari',
            description: 'A race of advanced humans with a focus on technology and resource efficiency.',
            bonus: { metal: 1.2, crystal: 1.1 }
        },
        {
            name: 'Coming Soon',
            description: 'More races will be added in future updates.',
            bonus: {}
        }
    ];

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
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
        console.log(`Added card for ${race.name}`);
    });
}
