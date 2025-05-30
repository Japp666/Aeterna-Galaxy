console.log('race.js loaded');

function initializeRaceSelection() {
    console.log('initializeRaceSelection called');
    const container = document.getElementById('race-selection');
    if (!container) {
        console.error('Race-selection container not found');
        return;
    }

    container.innerHTML = '';
    console.log('Cleared race-selection container');

    const races = [
        { name: 'Solari', description: 'Strălucitori, cu +20% energie.', image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png', selectable: true, bonus: { energy: 1.2 } },
        { name: 'Noxari', description: '+15% metal, -10% cercetare.', image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png', selectable: true, bonus: { metal: 1.15, research: 0.9 } },
        { name: 'Aetheri', description: '+20% cercetare, -15% heliu.', image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png', selectable: true, bonus: { research: 1.2, helium: 0.85 } }
    ];

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}" class="race-image">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            ${race.selectable ? `<button class="select-race" data-race="${race.name.toLowerCase()}">Alege</button>` : '<p class="race-unavailable">Indisponibil</p>'}
        `;
        container.appendChild(card);
        console.log(`Added card for ${race.name}`);
    });

    document.querySelectorAll('.select-race').forEach(button => {
        button.onclick = async () => {
            const race = button.dataset.race;
            console.log(`Selected race: ${race}`);
            gameState.player.race = race;
            gameState.raceBonus = races.find(r => r.name.toLowerCase() === race).bonus;
            document.getElementById('race-modal').style.display = 'none';
            updateHUD();
            await loadComponent('tab-buildings');
            nextTutorial();
        };
    });
}
