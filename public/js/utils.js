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
    }
};

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;
    msg.textContent = message;
    container.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}
