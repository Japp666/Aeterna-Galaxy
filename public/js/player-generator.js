// js/player-generator.js

const FIRST_NAMES = ["Alex", "Ben", "Chris", "Dave", "Ethan", "Frank", "George", "Henry", "Ian", "Jack", "Kyle", "Liam", "Mark", "Noah", "Oscar", "Paul", "Quinn", "Ryan", "Sam", "Tom", "Umar", "Victor", "Will", "Xavier", "Yusuf", "Zack"];
const LAST_NAMES = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark"];
const POSITIONS = ["GK", "DEF", "MID", "ATT"];
const RARITIES = {
    Common: { chance: 0.5, ovrRange: [40, 60], potentialRange: [50, 75] },
    Uncommon: { chance: 0.3, ovrRange: [55, 70], potentialRange: [65, 85] },
    Rare: { chance: 0.15, ovrRange: [65, 80], potentialRange: [75, 90] },
    Epic: { chance: 0.04, ovrRange: [75, 90], potentialRange: [85, 95] },
    Legendary: { chance: 0.01, ovrRange: [85, 99], potentialRange: [90, 99] }
};

/**
 * Generează un scor aleatoriu pentru un atribut.
 * @param {number} base - Baza scorului.
 * @param {number} range - Intervalul de variație.
 * @returns {number} Scor aleatoriu.
 */
function generateAttributeScore(base, range) {
    return Math.max(1, Math.min(99, base + Math.floor(Math.random() * (range * 2 + 1)) - range));
}

/**
 * Calculează OVR-ul bazat pe atribute. (Simplificat pentru exemplu)
 * OVR-ul real ar trebui să depindă de poziție și de ponderile atributelor.
 * @param {object} attributes - Obiectul cu atributele jucătorului.
 * @returns {number} Overall Rating.
 */
function calculateOVR(attributes) {
    const { defense, offense, physical, technique, speed, stamina } = attributes;
    // O formulă simplificată. Ajustează ponderile după nevoie.
    return Math.floor((defense + offense + physical + technique + speed + stamina) / 6);
}

/**
 * Generează un jucător nou cu atribute aleatorii.
 * @param {string} teamName - Numele echipei pentru care se generează jucătorul.
 * @returns {object} Obiectul jucătorului.
 */
export function generatePlayer(teamName) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18; // Vârsta între 18 și 35

    let rarityType = 'Common';
    const rarityRoll = Math.random();
    let cumulativeChance = 0;
    for (const rarity in RARITIES) {
        cumulativeChance += RARITIES[rarity].chance;
        if (rarityRoll <= cumulativeChance) {
            rarityType = rarity;
            break;
        }
    }

    const rarityInfo = RARITIES[rarityType];
    const initialOVR = Math.floor(Math.random() * (rarityInfo.ovrRange[1] - rarityInfo.ovrRange[0] + 1)) + rarityInfo.ovrRange[0];
    const potential = Math.floor(Math.random() * (rarityInfo.potentialRange[1] - rarityInfo.potentialRange[0] + 1)) + rarityInfo.potentialRange[0];

    const attributes = {
        defense: generateAttributeScore(initialOVR, 10),
        offense: generateAttributeScore(initialOVR, 10),
        physical: generateAttributeScore(initialOVR, 10),
        technique: generateAttributeScore(initialOVR, 10),
        speed: generateAttributeScore(initialOVR, 10),
        stamina: generateAttributeScore(initialOVR, 10),
    };

    // Ajustează atributele în funcție de poziție (simplificat)
    switch (position) {
        case "GK":
            attributes.defense = generateAttributeScore(initialOVR + 10, 5); // GK-ul are nevoie de apărare mare
            attributes.offense = generateAttributeScore(initialOVR - 20, 5);
            break;
        case "DEF":
            attributes.defense = generateAttributeScore(initialOVR + 5, 5);
            attributes.offense = generateAttributeScore(initialOVR - 10, 5);
            break;
        case "ATT":
            attributes.offense = generateAttributeScore(initialOVR + 5, 5);
            attributes.defense = generateAttributeScore(initialOVR - 10, 5);
            break;
    }

    const finalOVR = calculateOVR(attributes); // Recalculează OVR după ajustări

    return {
        id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        age: age,
        position: position,
        overallRating: finalOVR,
        potential: potential,
        rarity: rarityType,
        attributes: attributes,
        teamId: null // Va fi setat la asignarea la o echipă
    };
}

// Exemplu de utilizare (poate fi șters ulterior)
// console.log(generatePlayer("Test Team"));
