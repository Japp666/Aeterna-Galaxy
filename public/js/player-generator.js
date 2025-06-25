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
    if (age <= 22) {
        potentialRating += Math.floor(Math.random() * (20 - 10 + 1)) + 10; // Potențial mare pentru tineri
    } else if (age <= 27) {
        potentialRating += Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Potențial mediu
    } else {
        potentialRating += Math.floor(Math.random() * (5 - 0 + 1)); // Potențial mic
    }
    // Asigură că potențialul nu depășește 99
    potentialRating = Math.min(potentialRating, 99); 
    return getRarity(potentialRating);
}

/**
 * Generează un singur jucător cu o poziție distribuită conform necesarului.
 * @param {string[]} positionPool - Array de poziții din care să alegi.
 * @returns {object} Obiect jucător.
 */
function generatePlayer(positionPool) {
    const name = generateRandomName();
    const ovr = generateRandomOVR();
    const rarity = getRarity(ovr);
    const id = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18; // Vârsta între 18 și 35

    const position = positionPool[Math.floor(Math.random() * positionPool.length)];

    return {
        id,
        name,
        position,
        ovr,
        rarity,
        initials: getInitials(name), // Noile inițiale
        potential: generatePotential(ovr, age), // Noul atribut potențial
        isInjured: false,
        daysInjured: 0,
        image: '', // Fără imagini pentru jucători, așa cum s-a solicitat
        // Noi atribute de status (valori random pentru început)
        speed: Math.floor(Math.random() * (99 - 40 + 1)) + 40,
        attack: Math.floor(Math.random() * (99 - 40 + 1)) + 40,
        stamina: Math.floor(Math.random() * (99 - 40 + 1)) + 40,
        height: Math.floor(Math.random() * (200 - 165 + 1)) + 165, // cm
        weight: Math.floor(Math.random() * (95 - 60 + 1)) + 60,   // kg
        age: age
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
    // Ajustează numărul exact de jucători dacă rotunjirea a dat diferențe
    while (positionPool.length < numberOfPlayers) positionPool.push('MF'); // Adaugă MF ca default
    while (positionPool.length > numberOfPlayers) positionPool.pop();

    // Amestecă pool-ul de poziții
    for (let i = positionPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        // Asigură-te că positionPool nu devine gol înainte de a genera toți jucătorii
        if (positionPool.length === 0) {
             // Dacă pool-ul s-a golit prematur, re-populează-l
             for (const type of Object.keys(positionDistribution)) {
                const count = Math.round((numberOfPlayers - players.length) * positionDistribution[type]);
                for (let k = 0; k < count; k++) {
                    positionPool.push(type);
                }
            }
            if (positionPool.length === 0) { // Fallback extrem, adaugă un jucător generic
                positionPool.push('MF'); 
            }
            // Re-amestecă dacă a fost re-populat
            for (let j = positionPool.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [positionPool[j], positionPool[k]] = [positionPool[k], positionPool[j]];
            }
        }
        
        const player = generatePlayer(positionPool);
        players.push(player);
        // Scoate poziția folosită din pool
        const usedPositionIndex = positionPool.indexOf(player.position);
        if (usedPositionIndex > -1) {
            positionPool.splice(usedPositionIndex, 1);
        }
    }

    console.log("player-generator.js: Generare jucători finalizată. Număr total:", players.length);
    const positionCounts = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
    }, {});
    console.log("player-generator.js: Distribuția pozițiilor:", positionCounts);

    return players;
}
