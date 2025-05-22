import { showMessage } from './utils.js';

let player = {
    name: null,
    race: null,
    resources: {
        metal: 100,
        crystal: 100,
        energy: 100,
        helium: 50
    },
    resourceRates: {
        metal: 10,
        crystal: 5,
        energy: 20,
        helium: 2
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

export async function setPlayerName(name) {
    player.name = name;
    console.log(`Player name set to: ${player.name}`);
    await savePlayerData();
}

export async function setPlayerRace(race) {
    player.race = race;
    console.log(`Player race set to: ${player.race}`);
    await savePlayerData();
}

export function getPlayerName() {
    return player.name;
}

export function getPlayerRace() {
    return player.race;
}

export async function addBuildingToQueue(buildingId, timeToBuild = 10) {
    if (!player.buildingQueue) {
        player.buildingQueue = [];
    }
    player.buildingQueue.push({ id: buildingId, timeRemaining: timeToBuild });
    console.log(`Clădirea ${buildingId} adăugată în coada de construcție. Timp: ${timeToBuild}s`);
    await savePlayerData();
    startConstructionQueue();
}

export function getConstructionQueue() {
    if (!player.buildingQueue) {
        player.buildingQueue = [];
    }
    return player.buildingQueue;
}

async function savePlayerData() {
    if (!player.name) return;
    try {
        await firebase.firestore().collection('players').doc(player.name).set(player);
        console.log('Datele jucătorului salvate în Firestore.');
    } catch (error) {
        console.error('Eroare la salvarea datelor:', error);
        showMessage('Eroare la salvarea datelor jocului.', 'error');
    }
}

export async function loadPlayerData(nickname) {
    if (!nickname) return;
    try {
        const docRef = firebase.firestore().collection('players').doc(nickname);
        const docSnap = await docRef.get();
        if (docSnap.exists()) {
            player = { ...player, ...docSnap.data() };
            console.log('Datele jucătorului încărcate din Firestore:', player);
        } else {
            console.log('Niciun profil existent, folosind date implicite.');
            await savePlayerData();
        }
    } catch (error) {
        console.error('Eroare la încărcarea datelor:', error);
        showMessage('Eroare la încărcarea datelor jocului.', 'error');
    }
}

function startConstructionQueue() {
    setInterval(() => {
        if (player.buildingQueue.length === 0) return;
        player.buildingQueue = player.buildingQueue.map(item => ({
            ...item,
            timeRemaining: item.timeRemaining - 1
        })).filter(item => item.timeRemaining > 0);

        if (player.buildingQueue.length > 0) {
            const buildingId = player.buildingQueue[0].id;
            if (player.buildingQueue[0].timeRemaining <= 0) {
                player.buildings[buildingId] = (player.buildings[buildingId] || 0) + 1;
                player.buildingQueue.shift();
                showMessage(`Clădirea ${buildingId} a fost finalizată!`, 'success');
                savePlayerData();
            }
        }

        document.querySelectorAll('.building-card').forEach(card => {
            const button = card.querySelector('.build-button');
            const buildingId = button?.dataset.buildingId;
            const queueItem = player.buildingQueue.find(item => item.id === buildingId);
            const progressBarContainer = card.querySelector('.progress-bar-container');
            const progressBar = card.querySelector('.progress-bar');
            const progressText = card.querySelector('.progress-text');

            if (queueItem && progressBarContainer && progressBar && progressText) {
                progressBarContainer.style.display = 'block';
                const progress = ((buildingsData[buildingId].buildTime - queueItem.timeRemaining) / buildingsData[buildingId].buildTime) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;
                button.disabled = true;
            } else if (progressBarContainer && progressBar && progressText) {
                progressBarContainer.style.display = 'none';
                progressBar.style.width = '0%';
                progressText.textContent = '';
                button.disabled = false;
            }
        });
    }, 1000);
}
