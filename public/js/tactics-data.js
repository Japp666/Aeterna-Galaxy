// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Axa X: 0% = stânga (poarta noastră), 100% = dreapta (poarta adversă)
// Axa Y: 0% = sus (marginea terenului), 100% = jos (marginea terenului)
// Am ajustat toate coordonatele Y pentru a ridica jucătorii mai sus pe teren.

export const FORMATIONS = {
    // Portarul este mereu la aceeași poziție fixă, ajustat ușor mai sus
    GK: { x: 7.5, y: 48 }, // Ajustat de la 50 la 48

    '4-4-2': [
        // Apărare (defenders) - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 13 }, // Ajustat de la 15 la 13
        { pos: 'LCB', x: 22.5, y: 33 }, // Ajustat de la 35 la 33
        { pos: 'RCB', x: 22.5, y: 63 }, // Ajustat de la 65 la 63
        { pos: 'RB', x: 22.5, y: 83 }, // Ajustat de la 85 la 83

        // Mijloc (midfielders) - Ajustat Y mai sus
        { pos: 'LM', x: 47.5, y: 13 }, // Ajustat de la 15 la 13
        { pos: 'LCM', x: 47.5, y: 33 }, // Ajustat de la 35 la 33
        { pos: 'RCM', x: 47.5, y: 63 }, // Ajustat de la 65 la 63
        { pos: 'RM', x: 47.5, y: 83 }, // Ajustat de la 85 la 83

        // Atac (forwards) - Ajustat Y mai sus
        { pos: 'LS', x: 72.5, y: 38 }, // Ajustat de la 40 la 38
        { pos: 'RS', x: 72.5, y: 68 }  // Ajustat de la 60 la 68
    ],
    '4-3-3': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 13 },
        { pos: 'LCB', x: 22.5, y: 33 },
        { pos: 'RCB', x: 22.5, y: 63 },
        { pos: 'RB', x: 22.5, y: 83 },

        // Mijloc - Ajustat Y mai sus
        { pos: 'CDM', x: 47.5, y: 48 }, // Ajustat de la 50 la 48
        { pos: 'LCM', x: 57.5, y: 28 }, // Ajustat de la 30 la 28
        { pos: 'RCM', x: 57.5, y: 68 }, // Ajustat de la 70 la 68

        // Atac - Ajustat Y mai sus
        { pos: 'LW', x: 77.5, y: 13 }, // Ajustat de la 15 la 13
        { pos: 'ST', x: 82.5, y: 48 }, // Ajustat de la 50 la 48
        { pos: 'RW', x: 77.5, y: 83 }  // Ajustat de la 85 la 83
    ],
    '3-5-2': [
        // Apărare (3 defenders) - Ajustat Y mai sus
        { pos: 'LCB', x: 22.5, y: 28 }, // Ajustat de la 30 la 28
        { pos: 'CB', x: 17.5, y: 48 },  // Ajustat de la 50 la 48
        { pos: 'RCB', x: 22.5, y: 68 }, // Ajustat de la 70 la 68

        // Mijloc (5 midfielders) - Ajustat Y mai sus
        { pos: 'LWB', x: 37.5, y: 13 }, // Ajustat de la 15 la 13
        { pos: 'LCM', x: 52.5, y: 28 }, // Ajustat de la 30 la 28
        { pos: 'CM', x: 57.5, y: 48 },  // Ajustat de la 50 la 48
        { pos: 'RCM', x: 52.5, y: 68 }, // Ajustat de la 70 la 68
        { pos: 'RWB', x: 37.5, y: 83 }, // Ajustat de la 85 la 83

        // Atac (2 forwards) - Ajustat Y mai sus
        { pos: 'LS', x: 77.5, y: 38 }, // Ajustat de la 40 la 38
        { pos: 'RS', x: 77.5, y: 68 }  // Ajustat de la 60 la 68
    ],
    '4-2-3-1': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 13 },
        { pos: 'LCB', x: 22.5, y: 33 },
        { pos: 'RCB', x: 22.5, y: 63 },
        { pos: 'RB', x: 22.5, y: 83 },

        // Mijlocași defensivi (2) - Ajustat Y mai sus
        { pos: 'LDM', x: 37.5, y: 33 },
        { pos: 'RDM', x: 37.5, y: 63 },

        // Mijlocași ofensivi (3) - Ajustat Y mai sus
        { pos: 'LAM', x: 62.5, y: 23 }, // Ajustat de la 25 la 23
        { pos: 'CAM', x: 67.5, y: 48 }, // Ajustat de la 50 la 48
        { pos: 'RAM', x: 62.5, y: 73 }, // Ajustat de la 75 la 73

        // Atacant (1) - Ajustat Y mai sus
        { pos: 'ST', x: 82.5, y: 48 }   // Ajustat de la 50 la 48
    ],
    '5-3-2': [
        // Apărare (5 defenders) - Ajustat Y mai sus
        { pos: 'LWB', x: 17.5, y: 13 },
        { pos: 'LCB', x: 22.5, y: 28 },
        { pos: 'CB', x: 27.5, y: 48 },
        { pos: 'RCB', x: 22.5, y: 68 },
        { pos: 'RWB', x: 17.5, y: 83 },

        // Mijloc (3 midfielders) - Ajustat Y mai sus
        { pos: 'LCM', x: 52.5, y: 28 },
        { pos: 'CM', x: 57.5, y: 48 },
        { pos: 'RCM', x: 52.5, y: 68 },

        // Atac (2 forwards) - Ajustat Y mai sus
        { pos: 'LS', x: 77.5, y: 38 },
        { pos: 'RS', x: 77.5, y: 68 }
    ],
    '4-1-2-1-2': [ // Diamond
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 13 },
        { pos: 'LCB', x: 22.5, y: 33 },
        { pos: 'RCB', x: 22.5, y: 63 },
        { pos: 'RB', x: 22.5, y: 83 },

        // Mijlocaș defensiv (1) - Ajustat Y mai sus
        { pos: 'CDM', x: 37.5, y: 48 },

        // Mijlocași laterali (2) - Ajustat Y mai sus
        { pos: 'LM', x: 52.5, y: 23 },
        { pos: 'RM', x: 52.5, y: 73 },

        // Mijlocaș ofensiv (1) - Ajustat Y mai sus
        { pos: 'CAM', x: 67.5, y: 48 },

        // Atac (2 forwards) - Ajustat Y mai sus
        { pos: 'LS', x: 82.5, y: 38 },
        { pos: 'RS', x: 82.5, y: 68 }
    ],
    '3-4-3': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LCB', x: 22.5, y: 28 },
        { pos: 'CB', x: 17.5, y: 48 },
        { pos: 'RCB', x: 22.5, y: 68 },

        // Mijloc - Ajustat Y mai sus
        { pos: 'LM', x: 47.5, y: 13 },
        { pos: 'LCM', x: 47.5, y: 33 },
        { pos: 'RCM', x: 47.5, y: 63 },
        { pos: 'RM', x: 47.5, y: 83 },

        // Atac - Ajustat Y mai sus
        { pos: 'LW', x: 77.5, y: 23 },
        { pos: 'ST', x: 82.5, y: 48 },
        { pos: 'RW', x: 77.5, y: 73 }
    ],
    '4-5-1': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 13 },
        { pos: 'LCB', x: 22.5, y: 33 },
        { pos: 'RCB', x: 22.5, y: 63 },
        { pos: 'RB', x: 22.5, y: 83 },

        // Mijloc - Ajustat Y mai sus
        { pos: 'LDM', x: 37.5, y: 33 },
        { pos: 'CDM', x: 42.5, y: 48 },
        { pos: 'RDM', x: 37.5, y: 63 },
        { pos: 'LM', x: 52.5, y: 13 }, 
        { pos: 'RM', x: 52.5, y: 83 }, 

        // Atac - Ajustat Y mai sus
        { pos: 'ST', x: 82.5, y: 48 }
    ]
};

// Ajustări ale pozițiilor în funcție de mentalitate
export const MENTALITY_ADJUSTMENTS = {
    attacking: { xOffset: 8, yOffset: 0 }, 
    balanced: { xOffset: 0, yOffset: 0 },
    defensive: { xOffset: -8, yOffset: 0 } 
};

// Maparea pozițiilor scurte la poziții complete pentru afișare
export const POSITION_MAP = {
    'GK': 'Portar',
    'LB': 'Fundaș Stânga', 'LCB': 'Fundaș Central Stânga', 'CB': 'Fundaș Central', 'RCB': 'Fundaș Central Dreapta', 'RB': 'Fundaș Dreapta',
    'LWB': 'Fundaș Lateral Stânga', 'RWB': 'Fundaș Lateral Dreapta',
    'LM': 'Mijlocaș Stânga', 'LCM': 'Mijlocaș Central Stânga', 'RCM': 'Mijlocaș Central Dreapta', 'RM': 'Mijlocaș Dreapta',
    'CDM': 'Mijlocaș Defensiv Central', 'CM': 'Mijlocaș Central', 'CAM': 'Mijlocaș Ofensiv Central',
    'LW': 'Extremă Stânga', 'ST': 'Atacant Central', 'RW': 'Extremă Dreapta',
    'LS': 'Atacant Stânga', 'RS': 'Atacant Dreapta',
    'LDM': 'Mijlocaș Defensiv Stânga', 'RDM': 'Mijlocaș Defensiv Dreapta',
    'LAM': 'Mijlocaș Ofensiv Stânga', 'RAM': 'Mijlocaș Ofensiv Dreapta'
};
