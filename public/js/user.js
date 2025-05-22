// public/js/user.js - Gestionează datele jucătorului (nume, rasă, resurse etc.) și salvarea/încărcarea

let player = {
    name: null,
    race: null,
    resources: {
        energy: 100,
        minerals: 100,
        alloys: 50,
        food: 50
    },
    buildings: {}, // { 'power_plant': 1, 'mineral_mine': 2 }
    fleet: [],
    research: {},
    technologies: [],
    events: [],
    tutorialCompleted: false
};

const GAME_SAVE_KEY = 'galacticTycoonSave';

/**
 * Încarcă starea jocului din localStorage.
 */
function loadGameState() {
    const savedState = localStorage.getItem(GAME_SAVE_KEY);
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            // Copiază proprietățile salvate peste obiectul player existent
            Object.assign(player, parsedState);
            console.log("Game state loaded successfully.");
        } catch (e) {
            console.error("Failed to parse saved game state:", e);
            // Dacă eșuează, s-ar putea să vrei să resetezi sau să avertizezi jucătorul.
            localStorage.removeItem(GAME_SAVE_KEY); // Șterge starea coruptă
        }
    } else {
        console.log("No saved game state found.");
    }
}

/**
 * Salvează starea curentă a jocului în localStorage.
 */
export function saveGameState() {
    try {
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(player));
        console.log("Game state saved.");
    } catch (e) {
        console.error("Failed to save game state:", e);
    }
}

/**
 * Resetează toate datele jucătorului la valorile inițiale și șterge salvarea.
 * Util pentru testare sau pentru a începe un joc nou.
 */
export function resetGameData() {
    player = {
        name: null,
        race: null,
        resources: {
            energy: 100,
            minerals: 100,
            alloys: 50,
            food: 50
        },
        buildings: {},
        fleet: [],
        research: {},
        technologies: [],
        events: [],
        tutorialCompleted: false
    };
    localStorage.removeItem(GAME_SAVE_KEY);
    console.log("Game data reset and save removed.");
}

/**
 * Returnează obiectul player.
 * @returns {object} Obiectul player.
 */
export function getPlayer() { // <--- ADUGAȚI "export" AICI
    return player;
}

/**
 * Setează numele jucătorului și salvează.
 * @param {string} name Numele jucătorului.
 */
export function setPlayerName(name) {
    player.name = name;
    saveGameState();
}

/**
 * Setează rasa jucătorului și salvează.
 * @param {string} race Rasa jucătorului.
 */
export function setPlayerRace(race) {
    player.race = race;
    saveGameState();
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

// Încarcă starea jocului la inițializarea modulului
loadGameState();
