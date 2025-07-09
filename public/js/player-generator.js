// public/js/player-generator.js - Logică pentru generarea jucătorilor și atributelor

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
 * Rebalansat pentru majoritatea jucătorilor cu 1 poziție, câțiva cu 2.
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
    
    let positions = [];

    // Jucătorii GK au întotdeauna doar poziția GK
    if (positionType === 'GK') {
        positions.push('GK');
        return positions;
    }

    // Alege o poziție principală din lista specifică tipului
    const primaryPositionsForType = specificPositionsMap[positionType];
    if (primaryPositionsForType && primaryPositionsForType.length > 0) {
        // Alege o poziție primară aleatorie din cele specifice tipului
        positions.push(primaryPositionsForType[Math.floor(Math.random() * primaryPositionsForType.length)]);
    } else {
        // Fallback dacă nu se găsește o poziție specifică (nu ar trebui să se întâmple)
        console.warn(`player-generator.js: generatePlayablePositions() - Nu s-au găsit poziții specifice pentru tipul: ${positionType}. Atribuire poziție implicită.`);
        if (positionType === 'DF') positions.push('CB');
        else if (positionType === 'MF') positions.push('CM');
        else if (positionType === 'AT') positions.push('ST');
        else positions.push('CM'); 
    }

    // Adaugă o poziție secundară cu o probabilitate mică (de exemplu, 20%)
    if (Math.random() < 0.20) { // 20% șanse pentru o a doua poziție
        const allPossibleSpecificPositions = Object.values(specificPositionsMap).flat();
        const availableSecondaryPositions = allPossibleSpecificPositions.filter(p => !positions.includes(p));
        
        if (availableSecondaryPositions.length > 0) {
            let secondaryPos = null;
            // Încercăm să alegem o poziție secundară logică
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
            
            // Dacă nu s-a găsit o poziție logică, dar încă avem șanse, alege una la întâmplare
            if (!secondaryPos && Math.random() < 0.5) { // O șansă de 50% de a alege o poziție secundară aleatorie dacă nu s-a găsit una logică
                secondaryPos = availableSecondaryPositions[Math.floor(Math.random() * availableSecondaryPositions.length)];
            }

            if (secondaryPos) {
                positions.push(secondaryPos);
            }
        }
    }
    return [...new Set(positions)]; // Asigură unicitatea pozițiilor
}

/**
 * Generează atribute specifice pentru un jucător, bazate pe poziția și OVR-ul său.
 * Atributele vor fi grupate în DEFENSIV, OFENSIV, FIZIC.
 * @param {string} positionType - Tipul general de poziție (GK, DF, MF, AT).
 * @param {number} ovr - Overall rating al jucătorului.
 * @returns {object} Un obiect cu atributele detaliate.
 */
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

    // Baza atributelor este OVR-ul, cu ajustări în funcție de poziție
    const baseAttribute = Math.max(40, ovr - 10); // Asigură o bază minimă

    // Funcție ajutătoare pentru a genera o valoare a atributului
    const generateAttributeValue = (base, isPrimary) => {
        let value = base + Math.floor(Math.random() * (isPrimary ? 15 : 10)) - (isPrimary ? 5 : 0);
        return Math.max(1, Math.min(99, Math.round(value))); // Limitează la 1-99
    };

    switch (positionType) {
        case 'GK':
            // Portarii au atribute specifice, dar le vom mapa pe cele generale pentru simplitate
            // și le vom afișa ca atribute generale.
            // Pentru OVR, vom genera atributele generale.
            attributes.defensiv.deposedare = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.marcaj = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.pozitionare = generateAttributeValue(baseAttribute, true); // Important pentru GK
            attributes.defensiv.lovitura_de_cap = generateAttributeValue(baseAttribute, false);
            attributes.defensiv.curaj = generateAttributeValue(baseAttribute, true); // Important pentru GK

            attributes.ofensiv.pase = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.dribling = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.centrari = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.sutare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.finalizare = generateAttributeValue(baseAttribute, false);
            attributes.ofensiv.creativitate = generateAttributeValue(baseAttribute, false);

            attributes.fizic.vigoare = generateAttributeValue(baseAttribute, true); // Important pentru GK
            attributes.fizic.forta = generateAttributeValue(baseAttribute, true); // Important pentru GK
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

/**
 * Calculează numărul de steluțe (1-6) pe baza OVR-ului jucătorului.
 * @param {number} ovr - Overall rating al jucătorului (40-99).
 * @returns {number} Numărul de steluțe (1-6).
 */
export function getStars(ovr) {
    if (ovr >= 90) return 6; // World Class
    if (ovr >= 80) return 5; // Top Player / Star
    if (ovr >= 70) return 4; // Very Good / Talent
    if (ovr >= 60) return 3; // Good Player
    if (ovr >= 50) return 2; // Decent Player
    return 1; // Basic Player (OVR 40-49)
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
    const attributes = generatePlayerAttributes(mainPositionType, ovr); // Generează atributele detaliate

    // Asigură că playablePositions nu este gol
    if (playablePositions.length === 0) {
        console.error(`player-generator.js: Jucătorul ${name} a fost generat fără playablePositions. Asignare poziție implicită.`);
        if (mainPositionType === 'GK') playablePositions.push('GK');
        else if (mainPositionType === 'DF') playablePositions.push('CB');
        else if (mainPositionType === 'MF') playablePositions.push('CM');
        else if (mainPositionType === 'AT') playablePositions.push('ST');
        else playablePositions.push('CM');
    }

    // Setăm player.position la prima poziție jucabilă specifică, nu la tipul general (DF, MF, AT)
    const primarySpecificPosition = playablePositions[0];

    return {
        id,
        name,
        position: primarySpecificPosition, // Acum este o poziție specifică (ex: 'CB', 'CM', 'ST')
        playablePositions: playablePositions, 
        overall: ovr, 
        rarity,
        initials: getInitials(name),
        potential: generatePotential(ovr, age),
        isInjured: false,
        daysInjured: 0,
        image: '', 
        // Atributele generale vechi sunt acum înlocuite/suplimentate de cele detaliate
        speed: attributes.fizic.viteza, // Păstrăm compatibilitatea unde e necesar
        attack: attributes.ofensiv.sutare, // Exemplu de mapare
        stamina: attributes.fizic.vigoare, // Exemplu de mapare
        height: Math.round(Math.random() * (200 - 165 + 1)) + 165, 
        weight: Math.round(Math.random() * (95 - 60 + 1)) + 60,   
        age: age,
        value: Math.round((ovr * 10000) + (Math.random() * 500000)),
        attributes: attributes // NOU: Obiectul cu atribute detaliate
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

    // Distribuție ajustată pentru a asigura suficienți jucători pe fiecare tip de poziție
    const positionDistribution = {
        GK: 0.05, // 1-2 portari
        DF: 0.35, // ~9 fundași
        MF: 0.35, // ~9 mijlocași
        AT: 0.25  // ~6 atacanti
    };

    const positionTypesPool = [];
    for (const type of Object.keys(positionDistribution)) {
        const count = Math.round(numberOfPlayers * positionDistribution[type]);
        for (let i = 0; i < count; i++) {
            positionTypesPool.push(type);
        }
    }
    
    // Asigurăm că avem exact numărul dorit de jucători, ajustând dacă e cazul
    while (positionTypesPool.length < numberOfPlayers) positionTypesPool.push('MF'); // Adaugă mijlocași dacă sunt prea puțini
    while (positionTypesPool.length > numberOfPlayers) positionTypesPool.pop(); // Elimină dacă sunt prea mulți

    // Amestecă tipurile de poziții pentru a asigura o distribuție aleatorie
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
    console.log("player-generator.js: Distribuția pozițiilor principale (specifice):", positionCounts);

    return players;
}
