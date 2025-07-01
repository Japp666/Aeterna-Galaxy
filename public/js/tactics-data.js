// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Axa X: 0% = stânga (poarta noastră), 100% = dreapta (poarta adversă)
// Axa Y: 0% = sus (marginea terenului), 100% = jos (marginea terenului)

export const FORMATIONS = {
    // Portarul este mereu la aceeași poziție fixă
    GK: { x: 5, y: 50 }, 

    '4-4-2': [
        // Apărare (defenders)
        { pos: 'LB', x: 20, y: 12 }, // Fundaș Stânga - Ajustat y
        { pos: 'LCB', x: 25, y: 32 }, // Fundaș Central Stânga - Ajustat y
        { pos: 'RCB', x: 25, y: 68 }, // Fundaș Central Dreapta - Ajustat y
        { pos: 'RB', x: 20, y: 88 }, // Fundaș Dreapta - Ajustat y

        // Mijloc (midfielders)
        { pos: 'LM', x: 50, y: 12 }, // Mijlocaș Stânga - Ajustat y
        { pos: 'LCM', x: 50, y: 32 }, // Mijlocaș Central Stânga - Ajustat y
        { pos: 'RCM', x: 50, y: 68 }, // Mijlocaș Central Dreapta - Ajustat y
        { pos: 'RM', x: 50, y: 88 }, // Mijlocaș Dreapta - Ajustat y

        // Atac (forwards)
        { pos: 'LS', x: 80, y: 40 }, // Atacant Stânga
        { pos: 'RS', x: 80, y: 60 }  // Atacant Dreapta
    ],
    '4-3-3': [
        // Apărare
        { pos: 'LB', x: 20, y: 12 }, // Ajustat y
        { pos: 'LCB', x: 25, y: 32 }, // Ajustat y
        { pos: 'RCB', x: 25, y: 68 }, // Ajustat y
        { pos: 'RB', x: 20, y: 88 }, // Ajustat y

        // Mijloc
        { pos: 'CDM', x: 45, y: 50 }, 
        { pos: 'LCM', x: 60, y: 30 }, 
        { pos: 'RCM', x: 60, y: 70 }, 

        // Atac
        { pos: 'LW', x: 80, y: 12 }, // Ajustat y
        { pos: 'ST', x: 85, y: 50 }, 
        { pos: 'RW', x: 80, y: 88 }  // Ajustat y
    ],
    '3-5-2': [
        // Apărare (3 defenders)
        { pos: 'LCB', x: 25, y: 30 }, 
        { pos: 'CB', x: 20, y: 50 },  
        { pos: 'RCB', x: 25, y: 70 }, 

        // Mijloc (5 midfielders)
        { pos: 'LWB', x: 40, y: 12 }, // Ajustat y
        { pos: 'LCM', x: 55, y: 30 }, 
        { pos: 'CM', x: 60, y: 50 },  
        { pos: 'RCM', x: 55, y: 70 }, 
        { pos: 'RWB', x: 40, y: 88 }, // Ajustat y

        // Atac (2 forwards)
        { pos: 'LS', x: 80, y: 40 }, 
        { pos: 'RS', x: 80, y: 60 }  
    ],
    '4-2-3-1': [
        { pos: 'LB', x: 20, y: 12 }, // Ajustat y
        { pos: 'LCB', x: 25, y: 32 }, // Ajustat y
        { pos: 'RCB', x: 25, y: 68 }, // Ajustat y
        { pos: 'RB', x: 20, y: 88 }, // Ajustat y

        { pos: 'LDM', x: 40, y: 30 }, 
        { pos: 'RDM', x: 40, y: 70 }, 

        { pos: 'LAM', x: 65, y: 25 }, 
        { pos: 'CAM', x: 70, y: 50 }, 
        { pos: 'RAM', x: 65, y: 75 }, 

        { pos: 'ST', x: 85, y: 50 }   
    ],
    '5-3-2': [
        { pos: 'LWB', x: 15, y: 10 },
        { pos: 'LCB', x: 20, y: 30 },
        { pos: 'CB', x: 25, y: 50 },
        { pos: 'RCB', x: 20, y: 70 },
        { pos: 'RWB', x: 15, y: 90 },

        { pos: 'LCM', x: 50, y: 30 },
        { pos: 'CM', x: 55, y: 50 },
        { pos: 'RCM', x: 50, y: 70 },

        { pos: 'LS', x: 80, y: 40 },
        { pos: 'RS', x: 80, y: 60 }
    ],
    '4-1-2-1-2': [ // Diamond
        { pos: 'LB', x: 20, y: 12 }, // Ajustat y
        { pos: 'LCB', x: 25, y: 32 }, // Ajustat y
        { pos: 'RCB', x: 25, y: 68 }, // Ajustat y
        { pos: 'RB', x: 20, y: 88 }, // Ajustat y

        { pos: 'CDM', x: 40, y: 50 },

        { pos: 'LM', x: 55, y: 25 },
        { pos: 'RM', x: 55, y: 75 },

        { pos: 'CAM', x: 70, y: 50 },

        { pos: 'LS', x: 85, y: 40 },
        { pos: 'RS', x: 85, y: 60 }
    ],
    '3-4-3': [
        { pos: 'LCB', x: 25, y: 30 },
        { pos: 'CB', x: 20, y: 50 },
        { pos: 'RCB', x: 25, y: 70 },

        { pos: 'LM', x: 45, y: 12 }, // Ajustat y
        { pos: 'LCM', x: 50, y: 32 }, // Ajustat y
        { pos: 'RCM', x: 50, y: 68 }, // Ajustat y
        { pos: 'RM', x: 45, y: 88 }, // Ajustat y

        { pos: 'LW', x: 80, y: 25 },
        { pos: 'ST', x: 85, y: 50 },
        { pos: 'RW', x: 80, y: 75 }
    ],
    '4-5-1': [
        { pos: 'LB', x: 20, y: 12 }, // Ajustat y
        { pos: 'LCB', x: 25, y: 32 }, // Ajustat y
        { pos: 'RCB', x: 25, y: 68 }, // Ajustat y
        { pos: 'RB', x: 20, y: 88 }, // Ajustat y

        { pos: 'LDM', x: 40, y: 30 },
        { pos: 'CDM', x: 45, y: 50 },
        { pos: 'RDM', x: 40, y: 70 },
        { pos: 'LM', x: 55, y: 12 }, // Ajustat y
        { pos: 'RM', x: 55, y: 88 }, // Ajustat y

        { pos: 'ST', x: 85, y: 50 }
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
