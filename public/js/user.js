let player = {
    name: null,
    race: null,
    resources: {
        metal: 100,
        crystal: 100,
        helium: 50,
        energy: 100
    },
    buildings: {},
    buildingQueue: [],
    fleet: [],
    research: {},
    technologies: [],
    events: [],
    tutorialCompleted: false
};

export function getPlayer() {
    return player;
}

export function setPlayerName(name) {
    player.name = name;
    console.log(`Player name set to: ${player.name}`);
}

export function setPlayerRace(race) {
    player.race = race;
    console.log(`Player race set to: ${player.race}`);
}

export function getPlayerName() {
    return player.name;
}

export function getPlayerRace() {
    return player.race;
}

export function addBuildingToQueue(buildingId, timeToBuild = 10) {
    const player = getPlayer();
    if (!player.buildingQueue) {
        player.buildingQueue = [];
    }
    player.buildingQueue.push({ id: buildingId, timeRemaining: timeToBuild });
    console.log(`Clădirea ${buildingId} adăugată în coada de construcție. Timp: ${timeToBuild}s`);
}

export function getConstructionQueue() {
    const player = getPlayer();
    if (!player.buildingQueue) {
        player.buildingQueue = [];
    }
    return player.buildingQueue;
}
