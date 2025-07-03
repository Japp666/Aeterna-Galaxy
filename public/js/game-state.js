// public/js/game-state.js - Gestionează starea jocului (salvare/încărcare din Local Storage)

const GAME_STATE_KEY = 'footballManagerGameState';

// Funcții ajutătoare pentru generarea jucătorilor (copiate din player-generator.js pentru a evita dependența circulară la initialGameState)
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9);
}

function generateRandomName() {
    const firstNames = ["Virellon", "Straxar", "Demosian", "Valkor", "Synthrax", "Nocterra", "Skyrune", "Vendral", "Omnisar", "Nevrak", "Quarneth", "Silithor", "Yarenox", "Dreymar", "Luxarion", "Vohrak", "Zenithar", "Kalyrix", "Mektorr", "Voranthal", "Synthellis", "Krevon", "Aetheris", "Draxylon", "Solmyr", "Ulkaran", "Voxilis", "Terranox", "Xarneth", "Zynthari", "Helixor", "Crython", "Myrridan", "Zarqual", "Threxion", "Altherion", "Chronar", "Nytheris", "Kaevan", "Feronix", "Vaelthar", "Deymos", "Aurynox", "Vornax", "Trelyan", "Mirrodan", "Eriduun", "Vexallis", "Rynol"];
    const lastNames = ["Zorath", "Kaelix", "Draxon", "Korven", "Tharen", "Rion", "Jorik", "Kaian", "Solen", "Xandor", "Kiro", "Thalos", "Orrin", "Varek", "Kaelen", "Drex", "Thron", "Jaxen", "Zenix", "Orien", "Rhyen", "Eron", "Talon", "Vaelis", "Zevon", "Luthor", "Kaelor", "Brannic", "Tyros", "Jarek", "Malric", "Soren", "Caldus", "Neron", "Zayden", "Kaeris", "Fenric", "Lorcan", "Tovan", "Ryker", "Nyros", "Kelvar", "Arven", "Stravin", "Odan", "Valtor", "Quenric", "Maron", "Cynric", "Torven"];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateRandomOVR() {
    return Math.floor(Math.random() * (99 - 40 + 1)) + 40;
}

function getRarity(ovr) {
    if (ovr >= 90) return 'superstar';
    if (ovr >= 80) return 'legendary';
    if (ovr >= 70) return 'very-rare';
    if (ovr >= 60) return 'rare';
    return 'normal';
}

function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return parts[0].charAt(0);
}

function generatePotential(ovr, age) {
    let potentialRating = ovr;
    if (age <= 22) {
        potentialRating += Math.floor(Math.random() * (25 - 15 + 1)) + 15;
    } else if (age <= 27) {
        potentialRating += Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    } else if (age <= 30) {
        potentialRating += Math.floor(Math.random() * (5 - 0 + 1));
    } else {
        potentialRating -= Math.floor(Math.random() * 5);
    }
    potentialRating = Math.max(40, Math.min(potentialRating, 99)); 
    return getRarity(potentialRating);
}

function generatePlayablePositions(positionType) {
    const specificPositionsMap = {
        'GK': ['GK'],
        'DF': ['CB', 'LB', 'RB', 'LCB', 'RCB', 'LWB', 'RWB'],
        'MF': ['CM', 'CDM', 'CAM', 'LM', 'RM', 'LCM', 'RCM', 'LDM', 'RDM', 'LAM', 'RAM'],
        'AT': ['ST', 'LW', 'RW', 'LS', 'RS']
    };
    
    let positions = [];
    if (positionType === 'GK') {
        positions.push('GK');
        return positions;
    }
    const primaryPositionsForType = specificPositionsMap[positionType];
    if (primaryPositionsForType && primaryPositionsForType.length > 0) {
        positions.push(primaryPositionsForType[Math.floor(Math.random() * primaryPositionsForType.length)]);
    } else {
        if (positionType === 'DF') positions.push('CB');
        else if (positionType === 'MF') positions.push('CM');
        else if (positionType === 'AT') positions.push('ST');
        else positions.push('CM'); 
    }
    if (Math.random() < 0.20) {
        const allPossibleSpecificPositions = Object.values(specificPositionsMap).flat();
        const availableSecondaryPositions = allPossibleSpecificPositions.filter(p => !positions.includes(p));
        if (availableSecondaryPositions.length > 0) {
            let secondaryPos = null;
            if (positionType === 'DF') { 
                const potentialPositions = availableSecondaryPositions.filter(p => ['CDM', 'LWB', 'RWB', 'CM'].includes(p));
                if (potentialPositions.length > 0) secondaryPos = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
            } else if (positionType === 'MF') { 
                const potentialPositions = availableSecondaryPositions.filter(p => ['CAM', 'ST', 'LDM', 'RDM', 'CB'].includes(p));
                if (potentialPositions.length > 0) secondaryPos = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
            } else if (positionType === 'AT') { 
                const potentialPositions = availableSecondaryPositions.filter(p => ['CAM', 'LM', 'RM'].includes(p));
                if (potentialPositions.length > 0) secondaryPos = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
            }
            if (!secondaryPos && Math.random() < 0.5) {
                secondaryPos = availableSecondaryPositions[Math.floor(Math.random() * availableSecondaryPositions.length)];
            }
            if (secondaryPos) {
                positions.push(secondaryPos);
            }
        }
    }
    return [...new Set(positions)];
}

function generatePlayerAttributes(positionType, ovr) {
    const attributes = {
        defensiv: {
            deposedare: 0, marcaj: 0, pozitionare: 0, lovitura_de_cap: 0, curaj: 0
        },
        ofensiv: {
            pase: 0, dribling: 0, centrari: 0, sutare: 0, finalizare: 0, creativitate: 0
        },
        fizic: {
            vigoare: 0, forta: 0, agresivitate: 0, viteza: 0
        }
    };

    const baseAttribute = Math.max(40, ovr - 10);
    const generateAttributeValue = (base, isPrimary) => {
        let value = base + Math.floor(Math.random() * (isPrimary ? 15 : 10)) - (isPrimary ? 5 : 0);
        return Math.max(1, Math.min(99, Math.round(value)));
    };

    switch (positionType) {
        case 'GK':
            attributes.defensiv.deposedare = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.marcaj = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.pozitionare = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.lovitura_de_cap = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.curaj = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.pase = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.dribling = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.centrari = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.sutare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.finalizare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.creativitate = generateAttributeValue(baseAttribute, false);
            attributes.fizic.vigoare = generateAttributeValue(baseAttribute, true);
            attributes.fizic.forta = generateAttributeValue(baseAttribute, true);
            attributes.fizic.agresivitate = generateAttributeValue(baseAttribute, false);
            attributes.fizic.viteza = generateAttributeValue(baseAttribute, false);
            break;
        case 'DF':
            attributes.defensiv.deposedare = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.marcaj = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.pozitionare = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.lovitura_de_cap = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.curaj = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.pase = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.dribling = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.centrari = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.sutare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.finalizare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.creativitate = generateAttributeValue(baseAttribute, false);
            attributes.fizic.vigoare = generateAttributeValue(baseAttribute, true);
            attributes.fizic.forta = generateAttributeValue(baseAttribute, true);
            attributes.fizic.agresivitate = generateAttributeValue(baseAttribute, true);
            attributes.fizic.viteza = generateAttributeValue(baseAttribute, false);
            break;
        case 'MF':
            attributes.defensiv.deposedare = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.marcaj = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.pozitionare = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.lovitura_de_cap = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.curaj = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.pase = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.dribling = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.centrari = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.sutare = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.finalizare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.creativitate = generateAttributeValue(baseAttribute, true);
            attributes.fizic.vigoare = generateAttributeValue(baseAttribute, true);
            attributes.fizic.forta = generateAttributeValue(baseAttribute, false);
            attributes.fizic.agresivitate = generateAttributeValue(baseAttribute, false);
            attributes.fizic.viteza = generateAttributeValue(baseAttribute, true);
            break;
        case 'AT':
            attributes.defensiv.deposedare = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.marcaj = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.pozitionare = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.lovitura_de_cap = generateAttributeValue(baseAttribute, true);
            attributes.defensiv.curaj = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.pase = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.dribling = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.centrari = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.sutare = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.finalizare = generateAttributeValue(baseAttribute, true);
            attributes.ofensiv.creativitate = generateAttributeValue(baseAttribute, true);
            attributes.fizic.vigoare = generateAttributeValue(baseAttribute, true);
            attributes.fizic.forta = generateAttributeValue(baseAttribute, true);
            attributes.fizic.agresivitate = generateAttributeValue(baseAttribute, true);
            attributes.fizic.viteza = generateAttributeValue(baseAttribute, true);
            break;
    }
    return attributes;
}

function calculatePlayerOverall(attributes, position) {
    let overall = 0;
    let relevantAttributes = [];
    switch (position) {
        case 'GK':
            relevantAttributes = ['reflexes', 'handling', 'kicking', 'oneOnOnes', 'positioning', 'agility'];
            break;
        case 'CB': case 'LB': case 'RB': case 'LCB': case 'RCB': case 'LWB': case 'RWB':
            relevantAttributes = ['tackling', 'marking', 'strength', 'positioning', 'heading', 'pace'];
            break;
        case 'CM': case 'CDM': case 'CAM': case 'LM': case 'RM': case 'LCM': case 'RCM': case 'LDM': case 'RDM': case 'LAM': case 'RAM':
            relevantAttributes = ['passing', 'vision', 'dribbling', 'teamwork', 'stamina', 'decisionMaking'];
            break;
        case 'ST': case 'LW': case 'RW': case 'LS': case 'RS':
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

function generatePlayer(mainPositionType) {
    const name = generateRandomName();
    const ovr = generateRandomOVR();
    const rarity = getRarity(ovr);
    const id = `player_${Date.now()}_${Math.floor(Math.random() * 1000000)}`; 
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
    const playablePositions = generatePlayablePositions(mainPositionType);
    const attributes = generatePlayerAttributes(mainPositionType, ovr);

    if (playablePositions.length === 0) {
        console.error(`player-generator.js: Jucătorul ${name} a fost generat fără playablePositions. Asignare poziție implicită.`);
        if (mainPositionType === 'GK') playablePositions.push('GK');
        else if (mainPositionType === 'DF') playablePositions.push('CB');
        else if (mainPositionType === 'MF') playablePositions.push('CM');
        else if (mainPositionType === 'AT') playablePositions.push('ST');
        else playablePositions.push('CM');
    }
    const primarySpecificPosition = playablePositions[0];

    return {
        id,
        name,
        position: primarySpecificPosition,
        playablePositions: playablePositions, 
        overall: ovr, 
        rarity,
        initials: getInitials(name),
        potential: generatePotential(ovr, age),
        isInjured: false,
        daysInjured: 0,
        image: '', 
        speed: attributes.fizic.viteza,
        attack: attributes.ofensiv.sutare,
        stamina: attributes.fizic.vigoare,
        height: Math.round(Math.random() * (200 - 165 + 1)) + 165, 
        weight: Math.round(Math.random() * (95 - 60 + 1)) + 60,   
        age: age,
        value: Math.round((ovr * 10000) + (Math.random() * 500000)),
        attributes: attributes,
        fitness: 100, // NOU: fitness
        morale: 100,  // NOU: moral
        trainingFocus: 'REST', // NOU: focus antrenament
        onPitch: false // NOU: dacă jucătorul este pe teren (pentru tactici)
    };
}

// Starea inițială a jocului
const initialGameState = {
    isGameStarted: false, // Flag pentru a ști dacă jocul a fost pornit prima dată
    coach: {
        nickname: '',
        reputation: 0,
        experience: 0
    },
    club: {
        name: '',
        emblemUrl: '',
        funds: 0,
        reputation: 0,
        facilitiesLevel: 0,
        id: 'player-club' // ID fix pentru clubul jucătorului
    },
    players: [], // Jucătorii vor fi generați la start joc
    currentSeason: 1,
    currentDay: 1,
    currentFormation: '4-4-2', // Formație implicită
    currentMentality: 'balanced', // Mentalitate implicită
    teamFormation: { 'GK': null, 'LB': null, 'LCB': null, 'RCB': null, 'RB': null, 'LM': null, 'LCM': null, 'RCM': null, 'RM': null, 'LS': null, 'RS': null }, // Jucătorii alocați pe poziții pe teren
    news: [],
    allTeams: [] // Lista tuturor echipelor din ligă (pentru meciuri/clasament)
};

let gameState = loadGameStateFromLocalStorage() || initialGameState;

/**
 * Încarcă starea jocului din Local Storage.
 * @returns {object | null} Starea jocului sau null dacă nu există.
 */
function loadGameStateFromLocalStorage() {
    try {
        const savedState = localStorage.getItem(GAME_STATE_KEY);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Asigură-te că toate câmpurile necesare există, chiar dacă au fost adăugate ulterior
            const mergedState = { ...initialGameState, ...parsedState };

            // Asigură-te că jucătorii au noile atribute de fitness/morale/trainingFocus
            if (mergedState.players && mergedState.players.length > 0 && typeof mergedState.players[0].fitness === 'undefined') {
                mergedState.players = mergedState.players.map(player => ({
                    ...player,
                    fitness: player.fitness || 100,
                    morale: player.morale || 100,
                    trainingFocus: player.trainingFocus || 'REST',
                    isInjured: player.isInjured || false,
                    daysInjured: player.daysInjured || 0,
                    onPitch: player.onPitch || false // Asigură onPitch
                }));
            }
            // Asigură-te că teamFormation este inițializat corect
            if (!mergedState.teamFormation || Object.keys(mergedState.teamFormation).length === 0) {
                 mergedState.teamFormation = { 'GK': null, 'LB': null, 'LCB': null, 'RCB': null, 'RB': null, 'LM': null, 'LCM': null, 'RCM': null, 'RM': null, 'LS': null, 'RS': null };
            }
             // Asigură-te că allTeams este inițializat
            if (!mergedState.allTeams) {
                mergedState.allTeams = [];
            }
            // Asigură-te că clubul are un ID
            if (!mergedState.club.id) {
                mergedState.club.id = 'player-club';
            }


            console.log("game-state.js: Stare joc încărcată din localStorage.");
            return mergedState;
        }
    } catch (e) {
        console.error("game-state.js: Eroare la încărcarea stării jocului:", e);
    }
    console.log("game-state.js: Nu s-a găsit stare de joc salvată sau a apărut o eroare la încărcare.");
    return null;
}

/**
 * Salvează starea curentă a jocului în Local Storage.
 */
export function saveGameState() {
    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
        console.log("game-state.js: Stare joc salvată cu succes.");
    } catch (e) {
        console.error("game-state.js: Eroare la salvarea stării jocului:", e);
    }
}

/**
 * Returnează starea curentă a jocului.
 * @returns {object} Starea curentă a jocului.
 */
export function getGameState() {
    return gameState;
}

/**
 * Actualizează o parte din starea jocului și o salvează.
 * @param {object} updates - Un obiect cu proprietățile de actualizat.
 */
export function updateGameState(updates) {
    gameState = { ...gameState, ...updates };
    saveGameState();
    console.log("game-state.js: Stare joc actualizată:", updates);
}

/**
 * Resetează complet starea jocului la valorile inițiale și șterge din Local Storage.
 */
export function resetGameState() {
    console.log("game-state.js: Se resetează starea jocului...");
    localStorage.removeItem(GAME_STATE_KEY);
    gameState = { ...initialGameState }; // Resetăm la o copie a stării inițiale
    console.log("game-state.js: Starea jocului a fost resetată și ștearsă din Local Storage.");
    // Reîncărcăm pagina pentru a asigura o stare curată
    window.location.reload(); 
}
