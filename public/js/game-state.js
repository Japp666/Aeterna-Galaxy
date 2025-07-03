// public/js/game-state.js

let gameState = null; // Global game state

/**
 * Initializes a new game state.
 * @param {string} clubName - The name of the club.
 * @param {string} coachName - The name of the coach.
 */
export function initializeNewGameState(clubName, coachName) { // Semnătură funcție actualizată
    console.log("game-state.js: Initializing a new game state...");
    gameState = {
        club: {
            name: clubName,
            // Logica pentru emblemă îmbunătățită: asigură că textul nu este gol
            emblemUrl: 'https://placehold.co/60x60/000000/FFFFFF?text=' + (clubName ? clubName.substring(0, 3).toUpperCase() : 'CLB'), 
            funds: 1000000,
            reputation: 50,
            facilities: {
                trainingGround: 1,
                youthAcademy: 1,
                medicalCenter: 1
            }
        },
        coach: {
            name: coachName,
            // nickname: coachNickname, // Eliminat
            tacticalSkill: 70,
            motivationalSkill: 65,
            negotiationSkill: 60
        },
        players: generateInitialPlayers(25),
        currentSeason: 1,
        currentDay: 1,
        currentTab: 'dashboard',
        news: []
    };
    console.log("game-state.js: New game state initialized:", gameState);
}

/**
 * Generates a set of initial players for the team.
 * @param {number} count - The number of players to generate.
 * @returns {Array<object>} A list of player objects.
 */
function generateInitialPlayers(count) {
    const positions = ['GK', 'DEF', 'MID', 'FW'];
    const firstNames = ['Alex', 'Ben', 'Chris', 'David', 'Ethan', 'Frank', 'George', 'Henry', 'Ian', 'Jack'];
    const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson'];
    const players = [];

    for (let i = 0; i < count; i++) {
        const position = positions[Math.floor(Math.random() * positions.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const overall = Math.floor(Math.random() * (75 - 50 + 1)) + 50; // Overall between 50 and 75
        const age = Math.floor(Math.random() * (30 - 18 + 1)) + 18; // Age between 18 and 30

        players.push({
            id: `player_${Date.now()}_${i}`,
            name: `${firstName} ${lastName}`,
            position: position,
            overall: overall,
            age: age,
            value: overall * 10000, // Estimated value
            salary: overall * 500, // Estimated salary
            attributes: {
                pace: Math.floor(Math.random() * 40) + 50, // 50-90
                shooting: Math.floor(Math.random() * 40) + 50,
                passing: Math.floor(Math.random() * 40) + 50,
                dribbling: Math.floor(Math.random() * 40) + 50,
                defending: Math.floor(Math.random() * 40) + 50,
                physical: Math.floor(Math.random() * 40) + 50
            },
            contractExpires: `Sezon ${Math.floor(Math.random() * 3) + (gameState ? gameState.currentSeason : 1) + 1}`, // Contract for 1-3 seasons
            status: 'Healthy',
            morale: 'Good'
        });
    }
    console.log(`game-state.js: Generated ${count} initial players.`);
    return players;
}

/**
 * Returns the current game state.
 * @returns {object|null} The game state or null if not initialized.
 */
export function getGameState() {
    if (!gameState) {
        const loadedState = loadGameState();
        if (loadedState) {
            gameState = loadedState;
        } else {
            console.warn("game-state.js: Game state is not initialized and not saved. You will need to start a new game.");
            return null;
        }
    }
    return gameState;
}

/**
 * Updates the game state with a new state object.
 * @param {object} newState - The new game state object.
 */
export function updateGameState(newState) {
    console.log("game-state.js: Updating game state.");
    gameState = { ...gameState, ...newState };
    saveGameState(gameState);
}

/**
 * Saves the game state to localStorage.
 * @param {object} state - The game state object to save.
 */
export function saveGameState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('fmStellarLeagueGameState', serializedState);
        console.log("game-state.js: Game state saved to localStorage.");
    } catch (error) {
        console.error("game-state.js: Error saving game state:", error);
    }
}

/**
 * Loads the game state from localStorage.
 * @returns {object|null} The loaded game state or null if not found/error.
 */
export function loadGameState() {
    try {
        const serializedState = localStorage.getItem('fmStellarLeagueGameState');
        if (serializedState === null) {
            console.log("game-state.js: No game state saved in localStorage.");
            return null;
        }
        const parsedState = JSON.parse(serializedState);
        gameState = parsedState;
        console.log("game-state.js: Game state loaded from localStorage.");
        return parsedState;
    } catch (error) {
        console.error("game-state.js: Error loading game state:", error);
        return null;
    }
}
