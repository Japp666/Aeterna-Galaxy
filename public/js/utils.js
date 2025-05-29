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
        crystalMine: 0,
        solarPlant: 0,
        heliumRefinery: 0,
        shipyard: 0,
        researchLab: 0
    },
    buildingsList: [
        {
            name: 'Mina de Metal',
            key: 'metalMine',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 60, crystal: 15 },
            baseBuildTime: 10,
            production: { metal: 30 }
        },
        {
            name: 'Mina de Cristal',
            key: 'crystalMine',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 48, crystal: 24 },
            baseBuildTime: 15,
            production: { crystal: 20 }
        },
        {
            name: 'Centrală Solară',
            key: 'solarPlant',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 75, crystal: 30 },
            baseBuildTime: 12,
            production: { energy: 20 }
        },
        {
            name: 'Rafinărie de Heliu',
            key: 'heliumRefinery',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 100, crystal: 40, helium: 20 },
            baseBuildTime: 20,
            production: { helium: 10 }
        },
        {
            name: 'Șantier Naval',
            key: 'shipyard',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 200, crystal: 100, helium: 50 },
            baseBuildTime: 30,
            production: {}
        },
        {
            name: 'Laborator de Cercetare',
            key: 'researchLab',
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png',
            baseCost: { metal: 150, crystal: 80, helium: 30 },
            baseBuildTime: 25,
            production: {}
        }
    ],
    researches: {
        energyTech: 0,
        laserTech: 0,
        armorTech: 0
    },
    researchesList: [
        {
            name: 'Tehnologie Energie',
            key: 'energyTech',
            baseCost: { metal: 0, crystal: 800, helium: 400 },
            baseResearchTime: 30,
            requirements: { researchLab: 1 }
        },
        {
            name: 'Tehnologie Lasere',
            key: 'laserTech',
            baseCost: { metal: 200, crystal: 100, helium: 0 },
            baseResearchTime: 25,
            requirements: { researchLab: 2 }
        },
        {
            name: 'Tehnologie Blindaj',
            key: 'armorTech',
            baseCost: { metal: 1000, crystal: 0, helium: 0 },
            baseResearchTime: 35,
            requirements: { researchLab: 3 }
        }
    ],
    isBuilding: false,
    isResearching: false
};

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;
    msg.textContent = message;
    container.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}
