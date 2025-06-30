// public/js/player-generator.js - Logică pentru generarea jucătorilor

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
 * Asigură că fiecare jucător are cel puțin o poziție jucabilă.
 * @param {string} positionType - Tipul general de poziție (e.g., 'GK', 'DF').
 * @returns {string[]} Un array de poziții specifice (e.g., ['LB', 'LCB', 'RB']).
 */
function generatePlayablePositions(positionType) {
    const specificPositionsMap = {
        'GK': ['GK'],
        'DF': ['CB', 'LB', 'RB', 'LCB', 'RCB', 'LWB', 'RWB'],
        'MF': ['CM', 'CDM', 'CAM', 'LM', 'RM', 'LCM', 'RCM', 'LDM', 'RDM', 'LAM', 'RAM'],
        'AT': ['ST', 'LW', 'RW', 'LS', 'RS']
    };
    
    let positions = specificPositionsMap[positionType] ? [...specificPositionsMap[positionType]] : [];

    // Asigură că jucătorul are cel puțin o poziție specifică, dacă tipul general nu a dat nimic
    if (positions.length === 0) {
        console.warn(`player-generator.js: generatePlayablePositions() - Nu s-au găsit poziții specifice pentru tipul: ${positionType}. Atribuire poziție implicită.`);
        // Fallback: atribui o poziție generică dacă nu se găsește nimic
        if (positionType === 'GK') positions.push('GK');
        else if (positionType === 'DF') positions.push('CB');
        else if (positionType === 'MF') positions.push('CM');
        else if (positionType === 'AT') positions.push('ST');
        else positions.push('CM'); // Ultimul fallback
    }

    // Adaugă o poziție secundară dacă jucătorul e versatil
    if (Math.random() < 0.4 && positionType !== 'GK') { // 40% șanse de a fi versatil (nu portarii)
        const allPossibleSpecificPositions = Object.values(specificPositionsMap).flat();
        const availableSecondaryPositions = allPossibleSpecificPositions.filter(p => !positions.includes(p));
        
        if (availableSecondaryPositions.length > 0) {
            // Alege o poziție secundară care are sens din punct de vedere al apropierii pe teren
            let secondaryPos = null;
            if (positionType === 'DF') { // Fundașii pot fi mijlocași defensivi sau laterali
                const potentialPositions = availableSecondaryPositions.filter(p => ['CDM', 'LWB', 'RWB', 'CM'].includes(p));
                if (potentialPositions.length > 0) secondaryPos = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
            } else if (positionType === 'MF') { // Mijlocașii pot fi atacanți sau fundași defensivi
                const potentialPositions = availableSecondaryPositions.filter(p => ['CAM', 'ST', 'LDM', 'RDM', 'CB'].includes(p));
                if (potentialPositions.length > 0) secondaryPos = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
            } else if (positionType === 'AT') { // Atacanții pot fi mijlocași ofensivi
                const potentialPositions = availableSecondaryPositions.filter(p => ['CAM', 'LM', 'RM'].includes(p));
                if (potentialPositions.length > 0) secondaryPos = potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
            }
            
            // Dacă nu s-a găsit o poziție "sensibilă", alege una aleatorie cu șanse mai mici
            if (!secondaryPos && Math.random() < 0.2) { 
                secondaryPos = availableSecondaryPositions[Math.floor(Math.random() * availableSecondaryPositions.length)];
            }

            if (secondaryPos) {
                positions.push(secondaryPos);
            }
        }
    }
    return [...new Set(positions)]; // Elimină duplicatele și asigură un array unic
}


/**
 * Generează un singur jucător.
 * @param {string} mainPositionType - Tipul general de poziție (GK, DF, MF, AT).
 * @returns {object} Obiect jucător.
 */
function generatePlayer(mainPositionType) {
    const name = generateRandomName();
    const ovr = generateRandomOVR();
    const rarity = getRarity(ovr);
    const id = `player_${Date.now()}_${Math.floor(Math.random() * 1000000)}`; 
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
    const playablePositions = generatePlayablePositions(mainPositionType);

    // Asigură că playablePositions nu este gol
    if (playablePositions.length === 0) {
        console.error(`player-generator.js: Jucătorul ${name} a fost generat fără playablePositions. Asignare poziție implicită.`);
        if (mainPositionType === 'GK') playablePositions.push('GK');
        else if (mainPositionType === 'DF') playablePositions.push('CB');
        else if (mainPositionType === 'MF') playablePositions.push('CM');
        else if (mainPositionType === 'AT') playablePositions.push('ST');
        else playablePositions.push('CM');
    }

    return {
        id,
        name,
        position: mainPositionType, // Poziția principală generală (GK, DF, MF, AT)
        playablePositions: playablePositions, // Array cu pozițiile specifice jucate (e.g., ['LB', 'LCB', 'RB'])
        overall: ovr, 
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
        value: Math.round((ovr * 10000) + (Math.random() * 500000)) 
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

    const positionTypesPool = [];
    for (const type of Object.keys(positionDistribution)) {
        const count = Math.round(numberOfPlayers * positionDistribution[type]);
        for (let i = 0; i < count; i++) {
            positionTypesPool.push(type);
        }
    }
    
    while (positionTypesPool.length < numberOfPlayers) positionTypesPool.push('MF'); 
    while (positionTypesPool.length > numberOfPlayers) positionTypesPool.pop();

    for (let i = positionTypesPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positionTypesPool[i], positionTypesPool[j]] = [positionTypesPool[j], positionTypesPool[i]];
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        const positionType = positionTypesPool.pop(); 
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
