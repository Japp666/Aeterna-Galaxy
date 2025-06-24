// js/player-generator.js - Modul pentru generarea jucătorilor

// Liste pentru generarea numelor sci-fi
const firstNames = [
    "Astra", "Blaze", "Cinder", "Dax", "Echo", "Flux", "Gale", "Helix", "Ion", "Jett",
    "Kael", "Lyra", "Miro", "Nix", "Orion", "Pixel", "Quasar", "Rune", "Stryker", "Terra",
    "Umbra", "Vortex", "Wisp", "Xylon", "Yara", "Zenith", "Cygnus", "Nebula", "Sol", "Luna"
];

const lastNames = [
    "Blade", "Crest", "Drift", "Forge", "Glyph", "Haven", "Kinetic", "Lux", "Matrix", "Nexo",
    "Pulse", "Quake", "Rift", "Shade", "Spark", "Thorn", "Vance", "Whisper", "Xenon", "Zephyr",
    "Starwalker", "Void", "Cosmos", "Quantum", "Galactic", "Interstellar", "Astro", "Nova"
];

// Pozițiile posibile ale jucătorilor
const positions = ["Portar", "Fundaș", "Mijlocaș", "Atacant"];

// Definirea pragurilor pentru raritate în baza OvR
const rarityTiers = {
    'normal': { minOvR: 50, maxOvR: 65 },
    'rare': { minOvR: 66, maxOvR: 75 },
    'very-rare': { minOvR: 76, maxOvR: 85 },
    'legendary': { minOvR: 86, maxOvR: 92 },
    'superstar': { minOvR: 93, maxOvR: 99 }
};

/**
 * Generează un OvR aleatoriu în intervalul specificat.
 * @param {number} min - Overall minim.
 * @param {number} max - Overall maxim.
 * @returns {number} Overall generat.
 */
function getRandomOverall(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Atribuie raritatea bazată pe OvR.
 * @param {number} ovr - Overall Rating-ul jucătorului.
 * @returns {string} Numele rarității (ex: 'normal', 'rare').
 */
export function getRarityByOverall(ovr) {
    for (const tier in rarityTiers) {
        if (ovr >= rarityTiers[tier].minOvR && ovr <= rarityTiers[tier].maxOvR) {
            return tier;
        }
    }
    return 'normal'; // Fallback
}

/**
 * Generează un singur jucător cu atribute aleatorii.
 * @returns {object} Obiectul jucătorului.
 */
export function generatePlayer() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = getRandomOverall(18, 32);

    let ovr;
    const randomChance = Math.random();
    if (randomChance < 0.6) {
        ovr = getRandomOverall(rarityTiers.normal.minOvR, rarityTiers.normal.maxOvR);
    } else if (randomChance < 0.85) {
        ovr = getRandomOverall(rarityTiers.rare.minOvR, rarityTiers.rare.maxOvR);
    } else if (randomChance < 0.95) {
        ovr = getRandomOverall(rarityTiers['very-rare'].minOvR, rarityTiers['very-rare'].maxOvR);
    } else if (randomChance < 0.99) {
        ovr = getRandomOverall(rarityTiers.legendary.minOvR, rarityTiers.legendary.maxOvR);
    } else {
        ovr = getRandomOverall(rarityTiers.superstar.minOvR, rarityTiers.superstar.maxOvR);
    }

    const position = positions[Math.floor(Math.random() * positions.length)];
    const rarity = getRarityByOverall(ovr);
    const salary = Math.round((ovr * 1000 + Math.random() * 5000) / 100) * 100;
    const energy = 100;

    return {
        id: Date.now() + Math.random(),
        name: `${firstName} ${lastName}`,
        age: age,
        position: position,
        overall: ovr,
        rarity: rarity,
        salary: salary,
        energy: energy,
        currentSlot: null,
        isOnPitch: false
    };
}

/**
 * Generează un număr specificat de jucători inițiali pentru echipă.
 * @param {number} count - Numărul de jucători de generat.
 * @returns {Array<object>} Un array de obiecte jucător.
 */
export function generateInitialPlayers(count) {
    const players = [];
    for (let i = 0; i < count; i++) {
        players.push(generatePlayer());
    }
    return players;
}
