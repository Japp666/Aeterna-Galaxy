console.log('race.js loaded');

async function loadComponent(component, targetId = 'content') {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) {
        console.error(`Target div #${targetId} not found`);
        return;
    }
    try {
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`Failed to load ${component}.html`);
        targetDiv.innerHTML = await response.text();
        console.log(`Loaded ${component}.html into #${targetId}`);
        if (component === 'tab-buildings') initializeBuildings();
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error);
        targetDiv.innerHTML = `<p>Eroare la încărcarea ${component}. Verifică consola.</p>`;
    }
}

function initializeRaceSelection() {
    console.log('initializeRaceSelection called');
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
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
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
                ${race.name !== 'Coming Soon' ? `<button class="race-select-button" data-race="${index}">Selectează</button>` : ''}
                <button class="info-button" data-race="${index}">Info</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.race-select-button').forEach(button => {
        button.onclick = async () => {
            const raceIndex = parseInt(button.dataset.race);
            const race = races[raceIndex];
            gameState.player.race = race.name;
            showMessage(`Ai selectat rasa ${race.name}!`, 'success');
            updateHUD();
            console.log('Loading tab-buildings after race selection');
            await loadComponent('tab-buildings');
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
