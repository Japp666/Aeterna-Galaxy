function generateRandomName() {
    const firstNames = ["Andrei", "Bogdan", "Cristian", "Dan", "Emil", "Florin", "George",
        "Horia", "Ionut", "Marian", "Nicolae", "Ovidiu", "Petru", "Rares", "Ştefan", "Tudor", "Victor",
        "Alexandru", "Costin", "Dragos"];
    const lastNames = ["Popescu", "Ionescu", "Popa", "Radu", "Stan", "Dumitrescu",
        "Gheorghe", "Mihai", "Neagu", "Stoica", "Constantin", "Pop", "Dinu", "Marin", "Tudor", "Vlad",
        "Ion", "Voicu", "Zamfir", "Cristea"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function generateRandomOVR() {
    return Math.floor(Math.random() * (99 - 40 + 1)) + 40;
}

export function getRarity(ovr) {
    if (ovr >= 90) return 'superstar';
    if (ovr >= 80) return 'legendary';
    if (ovr >= 70) return 'very-rare';
    if (ovr >= 60) return 'rare';
    return 'normal';
}

function generatePlayer(positionPool) {
    const name = generateRandomName();
    const ovr = generateRandomOVR();
    const rarity = getRarity(ovr);
    const id = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const position = positionPool[Math.floor(Math.random() * positionPool.length)];
    return {
        id,
        name,
        position,
        ovr,
        rarity,
        isInjured: false,
        daysInjured: 0,
        image: `https://picsum.photos/seed/${id}/50/50`
    };
}

export function generateInitialPlayers(numberOfPlayers) {
    console.log(`player-generator.js: Încep să generez ${numberOfPlayers} jucători inițiali...`);
    const players = [];
    const positionDistribution = {
        GK: 0.10,
        DF: 0.35,
        MF: 0.35,
        AT: 0.20
    };
    const positionTypes = Object.keys(positionDistribution);
    const positionPool = [];
    
    for (const type of positionTypes) {
        const count = Math.round(numberOfPlayers * positionDistribution[type]);
        for (let i = 0; i < count; i++) {
            positionPool.push(type);
        }
    }
    
    for (let i = positionPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
    }
    
    for (let i = 0; i < numberOfPlayers; i++) {
        if (positionPool.length === 0) {
            for (const type of positionTypes) {
                const count = Math.round(numberOfPlayers * positionDistribution[type]);
                for (let k = 0; k < count; k++) {
                    positionPool.push(type);
                }
            }
            for (let j = positionPool.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [positionPool[j], positionPool[k]] = [positionPool[k], positionPool[j]];
            }
        }
        const player = generatePlayer(positionPool);
        players.push(player);
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
