console.log('utils.js loaded');

const gameState = {
    player: {},
    resources: {
        metal: 500,
        crystal: 500,
        helium: 100,
        energy: 0
    },
    production: {
        metal: 0,
        crystal: 0,
        helium: 0,
        energy: 0
    },
    buildings: {},
    researches: {},
    buildingsList: [
        {
            key: 'metal_mine',
            name: 'Mina de Metal',
            baseCost: { metal: 60, crystal: 15 },
            baseBuildTime: 10,
            production: { metal: 30 },
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        },
        {
            key: 'crystal_mine',
            name: 'Mina de Cristal',
            baseCost: { metal: 48, crystal: 24 },
            baseBuildTime: 15,
            production: { crystal: 20 },
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        },
        {
            key: 'solar_plant',
            name: 'Centrală Solară',
            baseCost: { metal: 75, crystal: 30 },
            baseBuildTime: 12,
            production: { energy: 20 },
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        },
        {
            key: 'helium_refinery',
            name: 'Rafinărie de Heliu',
            baseCost: { metal: 100, crystal: 40, helium: 20 },
            baseBuildTime: 20,
            production: { helium: 10 },
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        },
        {
            key: 'shipyard',
            name: 'Șantier Naval',
            baseCost: { metal: 200, crystal: 100, helium: 50 },
            baseBuildTime: 30,
            production: {},
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        },
        {
            key: 'research_lab',
            name: 'Laborator de Cercetare',
            baseCost: { metal: 150, crystal: 80, helium: 30 },
            baseBuildTime: 25,
            production: {},
            image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png'
        }
    ],
    researchList: [
        {
            key: 'energy_tech',
            name: 'Tehnologie Energie',
            baseCost: { metal: 100, crystal: 50 },
            baseResearchTime: 20
        },
        {
            key: 'laser_tech',
            name: 'Tehnologie Lasere',
            baseCost: { metal: 150, crystal: 100 },
            baseResearchTime: 30
        },
        {
            key: 'armor_tech',
            name: 'Tehnologie Blindaj',
            baseCost: { metal: 200, crystal: 150 },
            baseResearchTime: 40
        }
    ],
    isBuilding: false,
    isResearching: false
};

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}
