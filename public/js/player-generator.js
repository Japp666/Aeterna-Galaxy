// public/js/player-generator.js - Logică pentru generarea jucătorilor

// Noile liste de nume și prenume furnizate de utilizator
const firstNames = ["Virellon", "Straxar", "Demosian", "Valkor", "Synthrax", "Nocterra", "Skyrune", "Vendral", "Omnisar", "Nevrak", "Quarneth", "Silithor", "Yarenox", "Dreymar", "Luxarion", "Vohrak", "Zenithar", "Kalyrix", "Mektorr", "Voranthal", "Synthellis", "Krevon", "Aetheris", "Draxylon", "Solmyr", "Ulkaran", "Voxilis", "Terranox", "Xarneth", "Zynthari", "Helixor", "Crython", "Myrridan", "Zarqual", "Threxion", "Altherion", "Chronar", "Nytheris", "Kaevan", "Feronix", "Vaelthar", "Deymos", "Aurynox", "Vornax", "Trelyan", "Mirrodan", "Eriduun", "Vexallis", "Rynol"];
const lastNames = ["Zorath", "Kaelix", "Draxon", "Korven", "Tharen", "Rion", "Jorik", "Kaian", "Solen", "Xandor", "Kiro", "Thalos", "Orrin", "Varek", "Kaelen", "Drex", "Thron", "Jaxen", "Zenix", "Orien", "Rhyen", "Eron", "Talon", "Vaelis", "Zevon", "Luthor", "Kaelor", "Brannic", "Tyros", "Jarek", "Malric", "Soren", "Caldus", "Neron", "Zayden", "Kaeris", "Fenric", "Lorcan", "Tovan", "Ryker", "Nyros", "Kelvar", "Arven", "Stravin", "Odan", "Valtor", "Quenric", "Maron", "Cynric", "Torven"];

/**
 * Generează un nume aleatoriu.
 * @returns {string} Nume complet.
 */
function generateRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

/**
 * Generează un OVR (Overall Rating) aleatoriu.
 * @returns {number} OVR între 40 și 99.
 */
function generateRandomOVR() {
    return Math.floor(Math.random() * (99 - 40 + 1)) + 40;
}

/**
 * Determină raritatea unui jucător bazată pe OVR.
 * @param {number} ovr
 * @returns {string} Rarity (e.g., 'normal', 'rare', 'legendary').
 */
export function getRarity(ovr) {
    if (ovr >= 90) return 'superstar';
    if (ovr >= 80) return 'legendary';
    if (ovr >= 70) return 'very-rare';
    if (ovr >= 60) return 'rare';
    return 'normal';
}

/**
 * Calculează inițialele unui jucător.
 * @param {string} name - Numele complet al jucătorului.
 * @returns {string} Inițialele (ex: "JD").
 */
function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return parts[0].charAt(0);
}

/**
 * Generează un potențial pentru jucător bazat pe OVR și vârstă.
 * Potențialul este exprimat ca un nivel de raritate maxim posibil.
 * @param {number} ovr - Overall rating.
 * @param {number} age - Vârsta jucătorului.
 * @returns {string} Rarity level for potential (e.g., 'rare', 'legendary').
 */
function generatePotential(ovr, age) {
    let potentialRating = ovr;
    if (age <= 22) { // Jucători tineri
        potentialRating += Math.floor(Math.random() * (25 - 15 + 1)) + 15; // Potențial mare
    } else if (age <= 27) { // Jucători la maturitate timpurie
        potentialRating += Math.floor(Math.random() * (15 - 5 + 1)) + 5; // Potențial mediu
    } else if (age <= 30) { // Jucători maturi
        potentialRating += Math.floor(Math.random() * (5 - 0 + 1)); // Potențial mic
    } else { // Jucători veterani
        potentialRating -= Math.floor(Math.random() * 5); // Potențial negativ (scădere)
    }
    // Asigură că potențialul nu depășește 99 și nu scade sub 40
    potentialRating = Math.max(40, Math.min(potentialRating, 99)); 
    return getRarity(potentialRating);
}

/**
 * Generează un set de poziții specifice pe care le poate juca un jucător,
 * bazate pe tipul general de poziție (GK, DF, MF, AT).
 * @param {string} positionType - Tipul general de poziție (e.g., 'GK', 'DF').
 * @returns {string[]} Un array de poziții specifice (e.g., ['LB', 'CB', 'RB']).
 */
function generatePlayablePositions(positionType) {
    const positions = {
        'GK': ['GK'],
        'DF': ['LB', 'LCB', 'CB', 'RCB', 'RB', 'LWB', 'RWB'],
        'MF': ['CDM', 'CM', 'CAM', 'LM', 'LCM', 'RCM', 'RM', 'LDM', 'RDM', 'LAM', 'RAM'],
        'AT': ['LW', 'ST', 'RW', 'LS', 'RS']
    };
    let specificPositions = positions[positionType] || [];

    // Adaugă o poziție secundară dacă jucătorul e versatil
    if (Math.random() < 0.3) { // 30% șanse de a fi versatil
        const allPositionsFlat = Object.values(positions).flat();
        const availableSecondaryPositions = allPositionsFlat.filter(p => !specificPositions.includes(p));
        if (availableSecondaryPositions.length > 0) {
            const secondaryPos = availableSecondaryPositions[Math.floor(Math.random() * availableSecondaryPositions.length)];
            specificPositions.push(secondaryPos);
        }
    }
    return specificPositions;
}


/**
 * Generează un singur jucător.
 * @param {string} positionType - Tipul general de poziție (GK, DF, MF, AT).
 * @returns {object} Obiect jucător.
 */
function generatePlayer(positionType) {
    const name = generateRandomName();
    const ovr = generateRandomOVR();
    const rarity = getRarity(ovr);
    const id = `player_${Date.now()}_${Math.floor(Math.random() * 1000000)}`; // ID mai robust
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18; // Vârsta între 18 și 35
    const playablePositions = generatePlayablePositions(positionType);

    return {
        id,
        name,
        position: positionType, // Poziția principală (GK, DF, MF, AT)
        playablePositions: playablePositions, // Array cu toate pozițiile jucate
        overall: ovr, // OVR
        rarity,
        initials: getInitials(name),
        potential: generatePotential(ovr, age),
        isInjured: false,
        daysInjured: 0,
        image: '', 
        speed: Math.round(Math.random() * (99 - 40 + 1)) + 40,
        attack: Math.round(Math.random() * (99 - 40 + 1)) + 40,
        stamina: Math.round(Math.random() * (99 - 40 + 1)) + 40,
        height: Math.round(Math.random() * (200 - 165 + 1)) + 165, // cm
        weight: Math.round(Math.random() * (95 - 60 + 1)) + 60,   // kg
        age: age,
        value: Math.round((ovr * 10000) + (Math.random() * 500000)) // Valoare aproximată
    };
}

/**
 * Generează un set de jucători inițiali pentru lotul echipei.
 * @param {number} numberOfPlayers - Numărul total de jucători de generat.
 * @returns {Array<object>} Lista de obiecte jucător.
 */
export function generateInitialPlayers(numberOfPlayers) {
    console.log(`player-generator.js: Încep să generez ${numberOfPlayers} jucători inițiali...`);
    const players = [];

    const positionDistribution = {
        GK: 0.10, // 10% portari
        DF: 0.35, // 35% fundași
        MF: 0.35, // 35% mijlocași
        AT: 0.20  // 20% atacanți
    };

    const positionPool = [];
    for (const type of Object.keys(positionDistribution)) {
        const count = Math.round(numberOfPlayers * positionDistribution[type]);
        for (let i = 0; i < count; i++) {
            positionPool.push(type);
        }
    }
    
    // Asigură numărul exact de jucători, ajustând prin adăugare/eliminare de MF
    while (positionPool.length < numberOfPlayers) positionPool.push('MF'); 
    while (positionPool.length > numberOfPlayers) positionPool.pop();

    // Amestecă pool-ul de poziții pentru o distribuție aleatorie
    for (let i = positionPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        const positionType = positionPool.pop(); // Ia o poziție din pool
        const player = generatePlayer(positionType);
        players.push(player);
    }

    console.log("player-generator.js: Generare jucători finalizată. Număr total:", players.length);
    const positionCounts = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
    }, {});
    console.log("player-generator.js: Distribuția pozițiilor principale:", positionCounts);

    return players;
}
