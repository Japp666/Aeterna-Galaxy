console.log('utils.js loaded');

let gameState = {
    player: {
        name: '',
        race: ''
    },
    resources: {
        metal: 500,
        crystal: 500,
        helium: 0,
        energy: 0
    },
    production: {
        metal: 0,
        crystal: 0,
        helium: 0,
        energy: 0
    },
    buildings: {
        metalMine: 0,
        crystalMine: 0
    },
    buildingsList: [
        {
            name: 'Mina de Metal',
            key: 'metalMine',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 60, crystal: 15 },
            buildTime: 10,
            production: { metal: 30 }
        },
        {
            name: 'Mina de Cristal',
            key: 'crystalMine',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 48, crystal: 24 },
            buildTime: 15,
            production: { crystal: 20 }
        }
    ],
    isBuilding: false
};

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;
    msg.textContent = message;
    container.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}
