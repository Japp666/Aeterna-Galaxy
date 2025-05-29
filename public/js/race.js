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
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png' // Placeholder temporar
        },
        {
            name: 'Coming Soon',
            description: 'Această rasă va fi disponibilă în curând!',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        }
    ];

    races.forEach((race, index) => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}" onerror="console.error('Failed to load image ${race.image} at index ${index}')">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            <div class="race-card-buttons">
                <button class="race-select-button" data-race="${index}">Selectează</button>
                <button class="info-button" data-race="${index}">Info</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.race-select-button').forEach(button => {
        button.onclick = () => {
            const raceIndex = parseInt(button.dataset.race);
            const race = races[raceIndex];
            if (race.name !== 'Coming Soon') {
                gameState.player.race = race.name;
                showMessage(`Ai selectat rasa ${race.name}!`, 'success');
                updateHUD();
            } else {
                showMessage('Această rasă nu este disponibilă încă!', 'error');
            }
        };
    });

    document.querySelectorAll('.info-button').forEach(button => {
        button.onclick = () => {
            const raceIndex = parseInt(button.dataset.race);
            const race = races[raceIndex];
            showMessage(`Informații despre ${race.name}: ${race.description}`, 'success');
        };
    });
}
