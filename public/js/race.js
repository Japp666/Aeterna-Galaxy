console.log('race.js loaded');

async function loadComponent(component, targetId = 'content') {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) {
        console.error(`Target div #${targetId} not found`);
        return;
    }
    try {
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`Failed to load ${component}.html: ${response.status}`);
        targetDiv.innerHTML = await response.text();
        console.log(`Loaded ${component}.html into #${targetId}`);
        if (component === 'tab-buildings') initializeBuildings();
        if (component === 'tab-research') initializeResearch();
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error);
    }
}

function initializeRaceSelection() {
    console.log('initializeRaceSelection called');
    // Wait for DOM to ensure #race-selection is available
    setTimeout(() => {
        const container = document.getElementById('race-selection');
        if (!container) {
            console.error('Race-selection container not found in race-modal');
            return;
        }

        const races = [
            {
                name: 'Solari',
                description: 'Strălucitori și energici, cu bonus la producția de energie.',
                image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
                selectable: true
            },
            {
                name: 'Coming Soon',
                description: 'Această rasă va fi disponibilă în curând!',
                image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
                selectable: false
            }
        ];

        container.innerHTML = '';
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
        });

        document.querySelectorAll('.select-race').forEach(button => {
            button.onclick = async () => {
                const race = button.dataset.race;
                gameState.player.race = race;
                document.getElementById('race-modal').style.display = 'none';
                console.log('Hiding race modal, loading tab-buildings');
                updateHUD();
                await loadComponent('tab-buildings');
            };
        });
    }, 100);
}
