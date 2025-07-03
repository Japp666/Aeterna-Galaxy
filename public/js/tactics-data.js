// js/tactics-data.js

/**
 * Definește pozițiile pentru diferite formații pe un teren de fotbal virtual.
 * Coordonatele (x, y) sunt procentuale (0-100) față de lățimea/înălțimea terenului.
 * Y=0 este partea de sus a terenului, Y=100 este partea de jos (poarta proprie).
 * X=0 este stânga, X=100 este dreapta.
 */
export const FORMATIONS = {
    '4-4-2': [
        // Goalkeeper
        { id: 'gk1', type: 'GK', x: 50, y: 90 }, // Portar

        // Defenders (4)
        { id: 'rb', type: 'DEF', x: 15, y: 75 }, // Right Back
        { id: 'cb1', type: 'DEF', x: 40, y: 70 }, // Center Back 1
        { id: 'cb2', type: 'DEF', x: 60, y: 70 }, // Center Back 2
        { id: 'lb', type: 'DEF', x: 85, y: 75 }, // Left Back

        // Midfielders (4)
        { id: 'rm', type: 'MID', x: 15, y: 50 }, // Right Midfielder
        { id: 'cm1', type: 'MID', x: 40, y: 45 }, // Center Midfielder 1
        { id: 'cm2', type: 'MID', x: 60, y: 45 }, // Center Midfielder 2
        { id: 'lm', type: 'MID', x: 85, y: 50 }, // Left Midfielder

        // Attackers (2)
        { id: 'st1', type: 'ATT', x: 40, y: 25 }, // Striker 1
        { id: 'st2', type: 'ATT', x: 60, y: 25 }  // Striker 2
    ],
    '4-3-3': [
        // Goalkeeper
        { id: 'gk1', type: 'GK', x: 50, y: 90 },

        // Defenders (4)
        { id: 'rb', type: 'DEF', x: 15, y: 75 },
        { id: 'cb1', type: 'DEF', x: 40, y: 70 },
        { id: 'cb2', type: 'DEF', x: 60, y: 70 },
        { id: 'lb', type: 'DEF', x: 85, y: 75 },

        // Midfielders (3)
        { id: 'cdm', type: 'MID', x: 50, y: 55 }, // Central Defensive Midfielder
        { id: 'cm1', type: 'MID', x: 30, y: 45 },
        { id: 'cm2', type: 'MID', x: 70, y: 45 },

        // Attackers (3)
        { id: 'lw', type: 'ATT', x: 20, y: 25 }, // Left Winger
        { id: 'st', type: 'ATT', x: 50, y: 20 }, // Striker
        { id: 'rw', type: 'ATT', x: 80, y: 25 }  // Right Winger
    ],
    '3-5-2': [
        // Goalkeeper
        { id: 'gk1', type: 'GK', x: 50, y: 90 },

        // Defenders (3)
        { id: 'cb1', type: 'DEF', x: 30, y: 75 },
        { id: 'cb2', type: 'DEF', x: 50, y: 70 },
        { id: 'cb3', type: 'DEF', x: 70, y: 75 },

        // Midfielders (5)
        { id: 'lwb', type: 'MID', x: 10, y: 60 }, // Left Wing Back
        { id: 'cdm1', type: 'MID', x: 35, y: 50 },
        { id: 'cm', type: 'MID', x: 65, y: 50 },
        { id: 'cam', type: 'MID', x: 50, y: 35 }, // Central Attacking Midfielder
        { id: 'rwb', type: 'MID', x: 90, y: 60 }, // Right Wing Back

        // Attackers (2)
        { id: 'st1', type: 'ATT', x: 40, y: 20 },
        { id: 'st2', type: 'ATT', x: 60, y: 20 }
    ]
    // Poți adăuga mai multe formații aici
};

/**
 * Returnează array-ul de poziții pentru o anumită formație.
 * @param {string} formationKey - Cheia formației (ex: '4-4-2').
 * @returns {Array<Object>} Array de obiecte cu poziții (x, y, type).
 */
export function getFormationPositions(formationKey) {
    return FORMATIONS[formationKey] || FORMATIONS['4-4-2']; // Returnează 4-4-2 ca default
}

/**
 * Returnează lista de nume de formații disponibile.
 * @returns {Array<string>} Array de nume de formații.
 */
export function getAvailableFormations() {
    return Object.keys(FORMATIONS);
}
