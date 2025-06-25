// js/player-generator.js - Logică pentru generarea jucătorilor

/**
 * Generează un nume aleatoriu.
 * @returns {string} Nume complet.
 */
function generateRandomName() {
    const firstNames = ["Andrei", "Bogdan", "Cristian", "Dan", "Emil", "Florin", "George", "Horia", "Ionut", "Marian", "Nicolae", "Ovidiu", "Petru", "Rareș", "Ștefan", "Tudor", "Victor", "Alexandru", "Costin", "Dragoș"];
    const lastNames = ["Popescu", "Ionescu", "Popa", "Radu", "Stan", "Dumitrescu", "Gheorghe", "Mihai", "Neagu", "Stoica", "Constantin", "Pop", "Dinu", "Marin", "Tudor", "Vlad", "Ion", "Voicu", "Zamfir", "Cristea"];
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
export function getRarity(ovr) { // Acum funcția este exportată!
    if (ovr >= 90) return 'superstar';
    if (ovr >= 80) return 'legendary';
    if (ovr >= 70) return 'very-rare';
    if (ovr >= 60) return 'rare';
    return 'normal';
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

    // Alege o poziție din pool-ul dat
    const position = positionPool[Math.floor(Math.random() * positionPool.length)];

    return {
        id,
        name,
        position,
        ovr,
        rarity,
        isInjured: false,
        daysInjured: 0,
        image: `https://thispersondoesnotexist.com/?${id}` // Imagine aleatorie
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

    // Definirea pool-urilor de poziții cu o distribuție realistă
    // Exemplu: 2-3 portari, 7-8 fundași, 7-8 mijlocași, 4-5 atacanți
    const positionDistribution = {
        GK: 0.10, // 10% șanse să fie portar (ex: 2-3 din 25)
        DF: 0.35, // 35% șanse să fie fundaș (ex: 8-9 din 25)
        MF: 0.35, // 35% șanse să fie mijlocaș (ex: 8-9 din 25)
        AT: 0.20  // 20% șanse să fie atacant (ex: 4-5 din 25)
    };

    const positionTypes = Object.keys(positionDistribution);
    const positionPool = [];

    // Construiește un pool mare de poziții bazat pe distribuție
    for (const type of positionTypes) {
        const count = Math.round(numberOfPlayers * positionDistribution[type]);
        for (let i = 0; i < count; i++) {
            positionPool.push(type);
        }
    }

    // Amestecă pool-ul de poziții pentru a asigura o distribuție aleatorie
    for (let i = positionPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
    }

    // Generăm jucătorii, asigurându-ne că folosim pool-ul pentru poziții
    for (let i = 0; i < numberOfPlayers; i++) {
        // Dacă pool-ul s-a golit, umple-l din nou pentru a menține proporțiile
        if (positionPool.length === 0) {
            for (const type of positionTypes) {
                const count = Math.round(numberOfPlayers * positionDistribution[type]); // Re-calculăm proporțional
                for (let k = 0; k < count; k++) {
                    positionPool.push(type);
                }
            }
            // Amestecă din nou
            for (let j = positionPool.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [positionPool[j], positionPool[k]] = [positionPool[k], positionPool[j]];
            }
        }
        const player = generatePlayer(positionPool);
        players.push(player);
        // Elimină poziția folosită din pool pentru a evita repetarea imediată
        const usedPositionIndex = positionPool.indexOf(player.position);
        if (usedPositionIndex > -1) {
            positionPool.splice(usedPositionIndex, 1);
        }
    }

    console.log("player-generator.js: Generare jucători finalizată. Număr total:", players.length);
    // Verificare distribuție (doar pentru depanare, poate fi șters mai târziu)
    const positionCounts = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
    }, {});
    console.log("player-generator.js: Distribuția pozițiilor:", positionCounts);

    return players;
}
