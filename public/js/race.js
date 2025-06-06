console.log('race.js loaded');

function initializeRaceSelection() {
    const raceSelection = document.getElementById('race-selection');
    if (!raceSelection) {
        console.error('Race selection container not found');
        return;
    }

    const race = {
        name: 'Solari',
        description: 'Oameni adaptabili cu bonus la producție.',
        bonus: { metal: 1.1, crystal: 1.1 },
        image: 'https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png'
    };

    raceSelection.innerHTML = `
        <div class="race-card" data-race="${race.name}">
            <img src="${race.image}" alt="${race.name}">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            <button class="sf-button" onclick="selectRace('${race.name}')">Alege</button>
        </div>
    `;

    window.selectRace = (raceName) => {
        if (raceName === race.name) {
            gameState.raceBonus = race.bonus;
            window.onRaceSelected(raceName);
        }
    };
}
