console.log('utils.js loaded');

const gameState = {
    player: {
        name: 'Necunoscut',
        race: 'Neselectată',
        resources: { metal: 1000, crystal: 1000, helium: 500, energy: 500 },
        maxStorage: { metal: 1000, crystal: 1000, helium: 500, energy: 500 },
        incomePerHour: { metal: 0, crystal: 0, helium: 0, energy: 0 }, // Venit inițial 0
        buildings: {},
        activeConstructions: 0
    },
    buildingsData: {
        'metal-mine': {
            name: 'Mină de Metal',
            cost: { metal: 100, crystal: 50 },
            buildTime: 60,
            image: 'https://i.postimg.cc/wT1BrKSX/mina-de-metal-solari.jpg',
            requirements: {}
        },
        'crystal-mine': {
            name: 'Mină de Cristal',
            cost: { metal: 120, crystal: 60 },
            buildTime: 80,
            image: 'https://i.postimg.cc/qMW7VbT9/mina-de-crystal-solari.jpg',
            requirements: {}
        },
        'helium-mine': {
            name: 'Mină de Heliu',
            cost: { metal: 150, crystal: 80 },
            buildTime: 100,
            image: 'https://i.postimg.cc/D0Mwz5b4/mina-de-heliu-solari.jpg',
            requirements: {}
        },
        'power-plant': {
            name: 'Centrală Energetică',
            cost: { metal: 200, crystal: 100 },
            buildTime: 120,
            image: 'https://i.postimg.cc/G372z3S3/centrala-energetica-solari.jpg',
            requirements: {}
        },
        'metal-storage': {
            name: 'Depozit Metal',
            cost: { metal: 100, crystal: 50 },
            buildTime: 60,
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            requirements: {}
        },
        'crystal-storage': {
            name: 'Depozit Cristal',
            cost: { metal: 100, crystal: 50 },
            buildTime: 60,
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            requirements: {}
        },
        'helium-storage': {
            name: 'Depozit Heliu',
            cost: { metal: 100, crystal: 50 },
            buildTime: 60,
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            requirements: {}
        },
        'energy-storage': {
            name: 'Depozit Energie',
            cost: { metal: 100, crystal: 50 },
            buildTime: 60,
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            requirements: {}
        },
        'research-center': {
            name: 'Centru de Cercetare',
            cost: { metal: 300, crystal: 150, helium: 100 },
            buildTime: 180,
            image: 'https://i.postimg.cc/7PFRFdhv/centru-de-cercetare-solari.jpg',
            requirements: { 'power-plant': 2 }
        }
    }
};

function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    document.getElementById('message-container').appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

function updateResources() {
    const resources = gameState.player.resources;
    const maxStorage = gameState.player.maxStorage;
    const incomePerHour = gameState.player.incomePerHour;
    const incomePerMinute = {
        metal: incomePerHour.metal / 60,
        crystal: incomePerHour.crystal / 60,
        helium: incomePerHour.helium / 60,
        energy: incomePerHour.energy / 60
    };

    resources.metal = Math.min(resources.metal + incomePerMinute.metal, maxStorage.metal);
    resources.crystal = Math.min(resources.crystal + incomePerMinute.crystal, maxStorage.crystal);
    resources.helium = Math.min(resources.helium + incomePerMinute.helium, maxStorage.helium);
    resources.energy = Math.min(resources.energy + incomePerMinute.energy, maxStorage.energy);

    updateHUD();
}

setInterval(updateResources, 60 * 1000); // Actualizare la fiecare minut
