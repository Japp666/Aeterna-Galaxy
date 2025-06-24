// js/team.js - Logica pentru gestionarea și afișarea echipei

import { getGameState, updateGameState } from './game-state.js';

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

// Definirea pragurilor pentru raritate în baza OvR (culorile sunt definite în CSS)
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
function generatePlayer() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = getRandomOverall(18, 32); // Vârstă între 18 și 32

    // Distribuția OvR pentru a avea mai mulți jucători normali/rari la început
    let ovr;
    const randomChance = Math.random();
    if (randomChance < 0.6) { // 60% șanse de a fi Normal
        ovr = getRandomOverall(rarityTiers.normal.minOvR, rarityTiers.normal.maxOvR);
    } else if (randomChance < 0.85) { // 25% șanse de a fi Rar
        ovr = getRandomOverall(rarityTiers.rare.minOvR, rarityTiers.rare.maxOvR);
    } else if (randomChance < 0.95) { // 10% șanse de a fi Foarte Rar
        ovr = getRandomOverall(rarityTiers['very-rare'].minOvR, rarityTiers['very-rare'].maxOvR); // Notare corectă pentru very-rare
    } else if (randomChance < 0.99) { // 4% șanse de a fi Legendar
        ovr = getRandomOverall(rarityTiers.legendary.minOvR, rarityTiers.legendary.maxOvR);
    } else { // 1% șanse de a fi Vedetă
        ovr = getRandomOverall(rarityTiers.superstar.minOvR, rarityTiers.superstar.maxOvR);
    }

    const position = positions[Math.floor(Math.random() * positions.length)];

    const rarity = getRarityByOverall(ovr);
    const salary = Math.round((ovr * 1000 + Math.random() * 5000) / 100) * 100; // Salariu bazat pe OvR
    const energy = 100; // Energie inițială maximă

    return {
        id: Date.now() + Math.random(), // ID unic simplu
        name: `${firstName} ${lastName}`,
        age: age,
        position: position,
        overall: ovr,
        rarity: rarity, // Raritaatea va fi "normal", "rare", etc.
        salary: salary,
        energy: energy,
        // Potențial (poate fi ascuns sau calculat dinamic mai târziu)
        // Atribute specifice (viteza, tehnica etc. - pot fi adăugate mai târziu)
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

/**
 * Afișează lotul de jucători în tab-ul "Echipă".
 */
export function renderTeamRoster() {
    const rosterContainer = document.getElementById('roster');
    if (!rosterContainer) {
        console.error("Containerul lotului ('#roster') nu a fost găsit.");
        return;
    }

    const gameState = getGameState();
    const players = gameState.players;

    rosterContainer.innerHTML = ''; // Curățăm conținutul existent

    if (players.length === 0) {
        rosterContainer.innerHTML = '<p>Lotul echipei este gol. Generează jucători!</p>';
        return;
    }

    players.forEach(player => {
        const playerCard = document.createElement('div');
        // Adăugăm clasa pentru raritate pentru stilizare CSS
        playerCard.classList.add('player-card', `rarity-${player.rarity}`);

        playerCard.innerHTML = `
            <h3>${player.name}</h3>
            <p><strong>OvR:</strong> ${player.overall}</p>
            <p><strong>Poziție:</strong> ${player.position}</p>
            <p><strong>Vârstă:</strong> ${player.age}</p>
            <p><strong>Salariu:</strong> ${player.salary.toLocaleString('ro-RO')} Euro/săptămână</p>
            <p><strong>Energie:</strong> ${player.energy}%</p>
            <p><strong>Raritate:</strong> ${player.rarity.charAt(0).toUpperCase() + player.rarity.slice(1).replace('-', ' ')}</p>
            `;
        rosterContainer.appendChild(playerCard);
    });
}

/**
 * Inițializează tab-ul Echipă.
 */
export function initTeamTab() {
    renderTeamRoster();
}
