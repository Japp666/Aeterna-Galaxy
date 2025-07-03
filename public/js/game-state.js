// public/js/game-state.js - Gestionează starea globală a jocului (salvare/încărcare)
// Importul advanceDayAndApplyPlayerEffects a fost eliminat temporar, deoarece nextDay a fost eliminat.
// import { advanceDayAndApplyPlayerEffects } from './player-management.js'; // Această linie va fi reintrodusă când avem un mecanism de avansare a timpului.

let gameState = null; // Starea curentă a jocului

/**
 * Generează un ID unic simplu.
 * @returns {string} Un ID unic.
 */
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Generează un nume de jucător aleatoriu.
 * @returns {string} Numele complet al jucătorului.
 */
function generateRandomPlayerName() {
    const firstNames = ["Alex", "Bogdan", "Cristian", "Dan", "Emil", "Florin", "George", "Horia", "Iulian", "Ionut"];
    const lastNames = ["Popescu", "Ionescu", "Dumitrescu", "Vasilescu", "Georgescu", "Stan", "Radu", "Mihai", "Popa", "Dima"];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

/**
 * Generează un set de atribute aleatorii pentru un jucător.
 * @returns {object} Un obiect cu atributele jucătorului.
 */
function generateRandomAttributes() {
    const attributes = {};
    const attributeNames = [
        'shooting', 'passing', 'dribbling', 'tackling', 'marking',
        'positioning', 'speed', 'stamina', 'strength', 'vision',
        'decisionMaking', 'teamwork', 'acceleration', 'agility',
        'finishing', 'heading', 'reflexes', 'handling', 'kicking', 'oneOnOnes'
    ]; // Adăugăm atribute specifice portarilor

    attributeNames.forEach(attr => {
        attributes[attr] = Math.floor(Math.random() * 50) + 50; // Valori între 50 și 99
    });
    return attributes;
}

/**
 * Calculează Overall-ul jucătorului pe baza atributelor și poziției.
 * Aceasta este o funcție simplificată și ar trebui să fie mai complexă într-un joc real.
 * Replicată aici pentru a fi disponibilă și la generarea inițială.
 * @param {object} attributes - Obiectul cu atributele jucătorului.
 * @param {string} position - Poziția jucătorului (ex: 'ST', 'CB', 'GK').
 * @returns {number} Overall-ul calculat.
 */
function calculatePlayerOverall(attributes, position) {
    let overall = 0;
    let relevantAttributes = [];

    switch (position) {
        case 'GK':
            relevantAttributes = ['reflexes', 'handling', 'kicking', 'oneOnOnes', 'positioning', 'agility'];
            break;
        case 'CB':
        case 'LB':
        case 'RB':
        case 'LCB':
        case 'RCB':
        case 'LWB':
        case 'RWB':
            relevantAttributes = ['tackling', 'marking', 'strength', 'positioning', 'heading', 'pace'];
            break;
        case 'CM':
        case 'CDM':
        case 'CAM':
        case 'LM':
        case 'RM':
        case 'LCM':
        case 'RCM':
        case 'LDM':
        case 'RDM':
        case 'LAM':
        case 'RAM':
            relevantAttributes = ['passing', 'vision', 'dribbling', 'teamwork', 'stamina', 'decisionMaking'];
            break;
        case 'ST':
        case 'LW':
        case 'RW':
        case 'LS':
        case 'RS':
            relevantAttributes = ['shooting', 'dribbling', 'pace', 'finishing', 'acceleration', 'agility'];
            break;
        default:
            relevantAttributes = Object.keys(attributes);
    }

    if (relevantAttributes.length > 0) {
        const sumOfRelevantAttributes = relevantAttributes.reduce((sum, attr) => sum + (attributes[attr] || 0), 0);
        overall = sumOfRelevantAttributes / relevantAttributes.length;
    } else {
        const sumOfAllAttributes = Object.values(attributes).reduce((sum, val) => sum + val, 0);
        overall = sumOfAllAttributes / Object.keys(attributes).length;
    }

    return Math.round(overall);
}


/**
 * Generează un jucător nou cu atribute și proprietăți inițiale.
 * @param {string} position - Poziția jucătorului (ex: 'ST', 'CB', 'GK').
 * @returns {object} Obiectul jucătorului.
 */
function createPlayer(position) {
    const attributes = generateRandomAttributes();
    const overall = calculatePlayerOverall(attributes, position);
    const potential = Math.floor(Math.random() * 20) + overall; // Potențial puțin peste overall-ul curent

    return {
        id: generateUniqueId(),
        name: generateRandomPlayerName(),
        age: Math.floor(Math.random() * 10) + 18, // Vârstă între 18 și 27
        nationality: "România", // Poate fi extins ulterior
        position: position,
        overall: overall,
        potential: Math.min(100, potential), // Potențial maxim 100
        value: Math.floor(Math.random() * 100000) + 50000, // Valoare între 50.000 și 150.000
        salary: Math.floor(Math.random() * 5000) + 1000, // Salariu între 1.000 și 6.000
        attributes: attributes,
        fitness: 100, // Începe cu fitness maxim
        morale: 100,  // Începe cu moral maxim
        trainingFocus: 'REST', // Focus inițial pe odihnă
        isInjured: false,
        daysInjured: 0
    };
}

/**
 * Starea inițială a jocului.
 * @returns {object} Obiectul stării inițiale a jocului.
 */
function initialGameState() {
    const players = [];
    // Generăm câțiva jucători pentru echipa inițială
    players.push(createPlayer('GK')); // Portar
    players.push(createPlayer('CB')); // Fundaș Central
    players.push(createPlayer('CB')); // Fundaș Central
    players.push(createPlayer('LB')); // Fundaș Stânga
    players.push(createPlayer('RB')); // Fundaș Dreapta
    players.push(createPlayer('CM')); // Mijlocaș Central
    players.push(createPlayer('CM')); // Mijlocaș Central
    players.push(createPlayer('LW')); // Extrema Stânga
    players.push(createPlayer('RW')); // Extrema Dreapta
    players.push(createPlayer('ST')); // Atacant
    players.push(createPlayer('ST')); // Atacant
    // Adăugăm și câțiva jucători de rezervă
    for (let i = 0; i < 5; i++) {
        const positions = ['GK', 'CB', 'CM', 'ST', 'LB', 'RB', 'LW', 'RW'];
        players.push(createPlayer(positions[Math.floor(Math.random() * positions.length)]));
    }


    return {
        club: {
            name: "FC Stellar League",
            managerName: "Manager Galactic",
            reputation: 50,
            finances: {
                balance: 1000000, // 1 milion credite
                income: 0,
                expenses: 0
            }
        },
        league: {
            name: "Liga Stelară",
            teams: [], // Va fi populat cu alte echipe
            currentMatchday: 1,
            fixtures: [],
            table: []
        },
        players: players,
        currentDate: new Date().toISOString().slice(0, 10), // Format YYYY-MM-DD
        news: []
    };
}

/**
 * Salvează starea jocului în localStorage.
 * @param {object} state - Starea jocului de salvat.
 */
export function saveGameState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('fmStellarLeagueGameState', serializedState);
        console.log("Stare joc salvată în localStorage.");
    } catch (error) {
        console.error("Eroare la salvarea stării jocului:", error);
    }
}

/**
 * Încarcă starea jocului din localStorage.
 * @returns {object|null} Starea jocului încărcată sau null dacă nu există/eroare.
 */
export function loadGameState() {
    if (gameState) {
        return gameState; // Returnează starea curentă dacă este deja încărcată
    }
    try {
        const serializedState = localStorage.getItem('fmStellarLeagueGameState');
        if (serializedState === null) {
            console.log("Nicio stare salvată, se creează o stare nouă.");
            gameState = initialGameState();
            saveGameState(gameState); // Salvează starea inițială
            return gameState;
        }
        const parsedState = JSON.parse(serializedState);
        // Asigură-te că parsedState are toate câmpurile noi, dacă este o stare veche
        if (!parsedState.players[0].fitness) { // Verifică un câmp nou, de exemplu
            console.warn("Stare joc veche detectată, se actualizează structura jucătorilor.");
            parsedState.players = parsedState.players.map(player => ({
                ...player,
                fitness: player.fitness || 100,
                morale: player.morale || 100,
                trainingFocus: player.trainingFocus || 'REST',
                isInjured: player.isInjured || false,
                daysInjured: player.daysInjured || 0
            }));
            // Poți adăuga și alte default-uri pentru alte secțiuni dacă e cazul
        }
        gameState = parsedState;
        console.log("Stare joc încărcată din localStorage.");
        return gameState;
    } catch (error) {
        console.error("Eroare la încărcarea stării jocului:", error);
        // În caz de eroare la încărcare, începe un joc nou
        console.log("Se creează o stare nouă a jocului din cauza erorii de încărcare.");
        gameState = initialGameState();
        saveGameState(gameState);
        return gameState;
    }
}

/**
 * Actualizează starea jocului și o salvează.
 * @param {object} newState - Noua stare a jocului.
 */
export function updateGameState(newState) {
    gameState = newState;
    saveGameState(gameState);
}

/**
 * Returnează starea curentă a jocului.
 * @returns {object} Starea curentă a jocului.
 */
export function getGameState() {
    if (!gameState) {
        gameState = loadGameState(); // Asigură-te că starea este încărcată
    }
    return gameState;
}

// Funcția nextDay a fost eliminată conform cerinței utilizatorului.
// Vom discuta ulterior cum să implementăm progresul în timp real sau alte mecanisme de avansare.

