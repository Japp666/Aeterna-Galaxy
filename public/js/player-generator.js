// public/js/player-generator.js - Logică pentru generarea jucătorilor

import { getRarity } from './player-generator.js';
import { detailedPositionsMap, positionAttributes } from './formations-data.js'; // Importăm noile date

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
 * Generează un OVR (Overall Rating) aleatoriu cu o distribuție echilibrată.
 * Vom avea mai puțini jucători cu OVR foarte mare.
 * @returns {number} OVR între 40 și 99.
 */
function generateRandomOVR() {
    // Distribuție părtinitoare spre valori mai mici
    // 60% șanse pentru OVR 40-65 (normal/rare)
    // 30% șanse pentru OVR 66-80 (very-rare/legendary)
    // 10% șanse pentru OVR 81-99 (superstar)
    const rand = Math.random();
    if (rand < 0.6) { // Majoritatea jucătorilor sunt normal/rare
        return Math.floor(Math.random() * (65 - 40 + 1)) + 40;
    } else if (rand < 0.9) { // Un număr decent de very-rare/legendary
        return Math.floor(Math.random() * (80 - 66 + 1)) + 66;
    } else { // Foarte puțini superstar
        return Math.floor(Math.random() * (99 - 81 + 1)) + 81;
    }
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
    if (age <= 20) { // Jucători foarte tineri, potențial mare
        potentialRating += Math.floor(Math.random() * (20 - 10 + 1)) + 10; 
    } else if (age <= 24) { // Jucători tineri
        potentialRating += Math.floor(Math.random() * (15 - 5 + 1)) + 5; 
    } else if (age <= 28) { // Jucători la maturitate timpurie
        potentialRating += Math.floor(Math.random() * (8 - 2 + 1)) + 2; 
    } else if (age <= 30) { // Jucători maturi
        potentialRating += Math.floor(Math.random() * 3); 
    } else { // Jucători veterani
        potentialRating -= Math.floor(Math.random() * 5); 
    }
    // Asigură că potențialul nu depășește 99 și nu scade sub 40
    potentialRating = Math.max(40, Math.min(potentialRating, 99)); 
    return getRarity(potentialRating);
}

/**
 * Generează atribute specifice pentru un jucător, balansate în funcție de poziție.
 * Atributele sunt generate în jurul OVR-ului jucătorului, cu bonusuri/penalizări pe poziție.
 * @param {string} positionType - Poziția generală (GK, DF, MF, AT).
 * @param {number} ovr - Overall rating al jucătorului.
 * @returns {object} Obiect cu atributele generate.
 */
function generatePlayerAttributes(positionType, ovr) {
    const attributes = {};
    const baseOvrInfluence = ovr / 100; // 0.40 to 0.99
    
    // Generează atribute de bază între 40 și 99
    const generateAttribute = () => Math.floor(Math.random() * (99 - 40 + 1)) + 40;

    // Atribute comune
    attributes.speed = generateAttribute();
    attributes.attack = generateAttribute(); // Acesta va fi ajustat pentru GK
    attributes.stamina = generateAttribute();
    attributes.dribbling = generateAttribute();
    attributes.passing = generateAttribute();
    attributes.tackling = generateAttribute();
    attributes.shooting = generateAttribute();
    attributes.strength = generateAttribute();
    attributes.vision = generateAttribute();
    attributes.heading = generateAttribute(); // Noul atribut
    attributes.positioning = generateAttribute(); // Noul atribut

    // Atribute specifice pentru portari
    attributes.goalkeeping = generateAttribute(); // Noul atribut
    attributes.reflexes = generateAttribute(); // Noul atribut
    attributes.handling = generateAttribute(); // Noul atribut

    // Ajustează atributele pe baza OVR-ului și a rolului
    for (const attr in attributes) {
        // Atributele tind să fie mai aproape de OVR
        let adjustment = (Math.random() * 2 - 1) * 20; // +/- 20
        attributes[attr] = Math.max(40, Math.min(99, Math.round(attributes[attr] * baseOvrInfluence + (ovr * 0.5) + adjustment)));
    }

    // Balansare în funcție de poziție (bonusuri și penalizări)
    switch (positionType) {
        case 'GK':
            attributes.goalkeeping = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.reflexes = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.handling = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.positioning = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            
            attributes.attack = Math.max(20, ovr - (Math.random() * 30 + 10)); // Atac foarte mic
            attributes.shooting = Math.max(20, ovr - (Math.random() * 30 + 10));
            attributes.dribbling = Math.max(20, ovr - (Math.random() * 20 + 5));
            attributes.tackling = Math.max(20, ovr - (Math.random() * 20 + 5));
            attributes.heading = Math.max(20, ovr - (Math.random() * 20 + 5));
            break;
        case 'DF':
            attributes.tackling = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.marking = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.strength = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.heading = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.positioning = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));

            attributes.shooting = Math.max(20, ovr - (Math.random() * 30 + 10));
            attributes.attack = Math.max(20, ovr - (Math.random() * 20 + 5));
            attributes.goalkeeping = 1; attributes.reflexes = 1; attributes.handling = 1; // Foarte mici pentru non-GK
            break;
        case 'MF':
            attributes.passing = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.dribbling = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.vision = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.stamina = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));

            attributes.goalkeeping = 1; attributes.reflexes = 1; attributes.handling = 1;
            break;
        case 'AT':
            attributes.finishing = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.shooting = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.dribbling = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.speed = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));
            attributes.attack = Math.min(99, Math.max(60, ovr + (Math.random() * 10 - 5)));

            attributes.tackling = Math.max(20, ovr - (Math.random() * 20 + 5));
            attributes.goalkeeping = 1; attributes.reflexes = 1; attributes.handling = 1;
            break;
    }

    // Asigură-te că atributele non-cheie sunt în jurul OVR, dar cu o variație mai mare
    // și că atributele de GK sunt 1 pentru non-portari (pentru claritate și sortare)
    if (positionType !== 'GK') {
        attributes.goalkeeping = 1;
        attributes.reflexes = 1;
        attributes.handling = 1;
    }

    // Setează height și weight random
    attributes.height = Math.floor(Math.random() * (200 - 165 + 1)) + 165; // cm
    attributes.weight = Math.floor(Math.random() * (95 - 60 + 1)) + 60;   // kg

    return attributes;
}

/**
 * Generează un singur jucător cu o poziție detaliată.
 * @param {string} generalPosition - Poziția generală (GK, DF, MF, AT).
 * @returns {object} Obiect jucător.
 */
function generatePlayer(generalPosition) {
    const name = generateRandomName();
    const ovr = generateRandomOVR();
    const rarity = getRarity(ovr);
    const id = `player_${Date.now()}_${Math.floor(Math.random() * 100000)}`; // ID mai robust
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18; // Vârsta între 18 și 35

    // Alege o poziție detaliată din mapare
    const possibleDetailedPositions = detailedPositionsMap[generalPosition];
    const detailedPosition = possibleDetailedPositions[Math.floor(Math.random() * possibleDetailedPositions.length)];

    const attributes = generatePlayerAttributes(generalPosition, ovr);

    return {
        id,
        name,
        position: generalPosition, // Poziție generală (DF, MF, AT, GK)
        detailedPosition: detailedPosition, // Poziție detaliată (DC, MC, ST etc.)
        ovr,
        rarity,
        initials: getInitials(name),
        potential: generatePotential(ovr, age),
        isInjured: false,
        daysInjured: 0,
        image: '', 
        age,
        // Atribute specifice
        speed: attributes.speed,
        attack: attributes.attack,
        stamina: attributes.stamina,
        dribbling: attributes.dribbling,
        passing: attributes.passing,
        tackling: attributes.tackling,
        shooting: attributes.shooting,
        strength: attributes.strength,
        vision: attributes.vision,
        heading: attributes.heading,
        positioning: attributes.positioning,
        goalkeeping: attributes.goalkeeping,
        reflexes: attributes.reflexes,
        handling: attributes.handling,
        height: attributes.height,
        weight: attributes.weight
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

    // Distribuție generală pe poziții (procente)
    const generalPositionDistribution = {
        GK: 0.08, // 8% portari
        DF: 0.30, // 30% fundași
        MF: 0.35, // 35% mijlocași
        AT: 0.27  // 27% atacanți
    };

    // Creăm un pool de poziții generale bazat pe distribuție
    const positionPool = [];
    for (const type of Object.keys(generalPositionDistribution)) {
        const count = Math.round(numberOfPlayers * generalPositionDistribution[type]);
        for (let i = 0; i < count; i++) {
            positionPool.push(type);
        }
    }
    // Ajustează numărul exact de jucători dacă rotunjirea a dat diferențe
    while (positionPool.length < numberOfPlayers) positionPool.push('MF'); 
    while (positionPool.length > numberOfPlayers) positionPool.pop();

    // Amestecă pool-ul de poziții pentru a genera jucători într-o ordine aleatorie
    for (let i = positionPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positionPool[i], positionPool[j]] = [positionPool[j], positionPool[i]];
    }

    for (let i = 0; i < numberOfPlayers; i++) {
        const player = generatePlayer(positionPool[i % positionPool.length]); // Folosim restul pentru a ne asigura că avem poziții dacă pool-ul e mai mic
        players.push(player);
    }

    console.log("player-generator.js: Generare jucători finalizată. Număr total:", players.length);
    const positionCounts = players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
    }, {});
    console.log("player-generator.js: Distribuția pozițiilor generale:", positionCounts);

    return players;
}
