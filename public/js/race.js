console.log('race.js loaded');

function initializeRaceSelection() {
    const raceSelection = document.getElementById('race-selection');
    if (!raceSelection) {
        console.error('Race selection container not found');
        return;
    }

    const races = [
        { 
            name: 'Terrani', 
            description: 'Oameni adaptabili cu bonus la producție.', 
            bonus: { metal: 1.1, crystal: 1.1 }, 
            image: 'https://i.postimg.cc/zG7Y2k3n/terrani.png' 
        },
        { 
            name: 'Zorani', 
            description: 'Extratereștri tehnologici cu bonus la cercetare.', 
            bonus: { research: 1.2 }, 
            image: 'https://i.postimg.cc/3JqX7W3Q/zorani.png' 
        },
        { 
            name: 'Kryon', 
            description: 'Războinici cu bonus la flote.', 
            bonus: { shipSpeed: 1.15 }, 
            image: 'https://i.postimg.cc/Kv7B0m2k/kryon.png' 
        }
    ];

    raceSelection.innerHTML = races.map(race => `
        <div class="race-card" data-race="${race.name}">
            <img src="${race.image}" alt="${race.name}">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
        </div>
    `).join('');

    raceSelection.addEventListener('click', (e) => {
        const card = e.target.closest('.race-card');
        if (card) {
            const raceName = card.getAttribute('data-race');
            const race = races.find(r => r.name === raceName);
            if (race) {
                gameState.raceBonus = race.bonus;
                window.onRaceSelected(raceName);
            }
        }
    });
}
