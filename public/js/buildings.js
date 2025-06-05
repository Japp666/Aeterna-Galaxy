console.log('buildings.js loaded');

function initializeBuildings(attempts = 0, maxAttempts = 10) {
    console.log('initializeBuildings called');
    const economyList = document.getElementById('economy-buildings');
    const militaryList = document.getElementById('military-buildings');
    const defenseList = document.getElementById('defense-buildings');

    if (!economyList || !militaryList || !defenseList) {
        console.warn('Building lists not found, DOM may not be ready:', {
            economyList: !!economyList,
            militaryList: !!militaryList,
            defenseList: !!defenseList
        });
        if (attempts < maxAttempts) {
            setTimeout(() => initializeBuildings(attempts + 1), 100);
        } else {
            console.error('Failed to initialize buildings after max attempts');
        }
        return;
    }

    // Clear lists
    economyList.innerHTML = '';
    militaryList.innerHTML = '';
    defenseList.innerHTML = '';

    const buildings = [
        { id: 'mine', name: 'Mină de Metal', type: 'economy', cost: { metal: 100, crystal: 50 }, production: { metal: 20 } },
        { id: 'barracks', name: 'Cazarma', type: 'military', cost: { metal: 200, crystal: 100 }, production: {} },
        { id: 'turret', name: 'Turelă', type: 'defense', cost: { metal: 150, crystal: 75 }, production: {} }
    ];

    buildings.forEach(building => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${building.name} (Cost: ${building.cost.metal}M, ${building.cost.crystal}C)</span>
            <button class="sf-button">Construiește</button>
        `;
        li.querySelector('button').addEventListener('click', () => {
            console.log(`Building ${building.name}`);
            // Add building logic here
        });
        if (building.type === 'economy') economyList.appendChild(li);
        else if (building.type === 'military') militaryList.appendChild(li);
        else if (building.type === 'defense') defenseList.appendChild(li);
    });

    console.log('Buildings initialized');
}
