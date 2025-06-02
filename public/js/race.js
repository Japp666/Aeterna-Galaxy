console.log('race.js loaded');

function initializeRaceSelection() {
    console.log('initializeRaceSelection called');
    const raceSelection = document.getElementById('race-selection');
    if (!raceSelection) {
        console.error('Race selection container not found');
        return;
    }

    raceSelection.innerHTML = '';
    console.log('Cleared race-selection container');

    const races = [
        {
            name: 'Solari',
            description: 'O rasă avansată tehnologic, specializată în minerit și energie solară.',
            image: 'https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png',
            bonus: { metal: 1.2, energy: 1.2 }
        },
        {
            name: 'Coming Soon',
            description: 'Această rasă va fi disponibilă în viitor.',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            bonus: {},
            disabled: true
        }
    ];

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        if (race.disabled) {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
        }
        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
        `;
        if (!race.disabled) {
            card.addEventListener('click', () => {
                console.log('Selected race:', race.name.toLowerCase());
                gameState.raceBonus = race.bonus;
                gameState.player.race = race.name;
                saveGame();
                window.onRaceSelected(race.name.toLowerCase());
            });
        }
        raceSelection.appendChild(card);
        console.log(`Added card for ${race.name}`);
    });
}
