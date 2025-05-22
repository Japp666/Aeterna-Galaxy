// public/js/user.js - Gestionează datele jucătorului (nume, rasă, resurse etc.)

// Obiectul player, cu valori inițiale. Acestea vor fi resetate la fiecare refresh.
let player = {
    name: null,
    race: null,
    resources: {
        energy: 100,
        minerals: 100,
        alloys: 50,
        food: 50
    },
    buildings: {}, // { 'power_plant': 1, 'mineral_mine': 2 } - pentru clădiri construite
    buildingQueue: [], // Coada de construcție: [{ id: 'power_plant', timeRemaining: 10 }]
    fleet: [],
    research: {},
    technologies: [],
    events: [],
    tutorialCompleted: false
};

/**
 * Returnează obiectul player.
 * @returns {object} Obiectul player.
 */
export function getPlayer() {
    return player;
}

/**
 * Setează numele jucătorului.
 * @param {string} name Numele jucătorului.
 */
export function setPlayerName(name) {
    player.name = name;
    console.log(`Player name set to: ${player.name}`);
}

/**
 * Setează rasa jucătorului.
 * @param {string} race Rasa jucătorului.
 */
export function setPlayerRace(race) {
    player.race = race;
    console.log(`Player race set to: ${player.race}`);
}

/**
 * Returnează numele jucătorului.
 * @returns {string|null} Numele jucătorului sau null.
 */
export function getPlayerName() {
    return player.name;
}

/**
 * Returnează rasa jucătorului.
 * @returns {string|null} Rasa jucătorului sau null.
 */
export function getPlayerRace() {
    return player.race;
}

/**
 * Adaugă o clădire în coada de construcție.
 * Aceasta este o implementare de bază. Ar trebui extinsă cu costuri, timp etc.
 * @param {string} buildingId ID-ul clădirii de adăugat.
 * @param {number} timeToBuild Timpul necesar construcției (în secunde/tick-uri).
 */
export function addBuildingToQueue(buildingId, timeToBuild = 10) {
    const player = getPlayer();
    if (!player.buildingQueue) {
        player.buildingQueue = [];
    }
    // Verifică resursele necesare aici înainte de a adăuga
    // De exemplu: if (player.resources.minerals < buildingCost) { showMessage('Nu ai suficiente resurse!', 'error'); return; }

    player.buildingQueue.push({ id: buildingId, timeRemaining: timeToBuild });
    console.log(`Clădirea ${buildingId} adăugată în coada de construcție. Timp: ${timeToBuild}s`);
    // showMessage(`Construcție ${buildingId} începută!`, 'info');
    // Aici ar trebui să scazi resursele jucătorului după ce clădirea este adăugată în coadă.
}

/**
 * Returnează coada de construcție a jucătorului.
 * @returns {Array} Un array de obiecte reprezentând clădirile în coada de construcție.
 */
export function getConstructionQueue() {
    const player = getPlayer();
    if (!player.buildingQueue) {
        player.buildingQueue = [];
    }
    return player.buildingQueue;
}

// Nu mai este nevoie de loadGameState() sau saveGameState() la pornire,
// deoarece datele nu sunt salvate persistent.
