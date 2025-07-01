// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Axa X: 0% = stânga (poarta noastră), 100% = dreapta (poarta adversă)
// Axa Y: 0% = sus (marginea terenului), 100% = jos (marginea terenului)
// Am ajustat toate coordonatele Y pentru a ridica jucătorii mai sus pe teren.

export const FORMATIONS = {
    // Portarul este mereu la aceeași poziție fixă, ajustat ușor mai sus și mai retras spre poartă
    GK: { x: 6.5, y: 45 }, 

    '4-4-2': [
        // Apărare (defenders) - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 10 }, 
        { pos: 'LCB', x: 22.5, y: 30 }, 
        { pos: 'RCB', x: 22.5, y: 60 }, 
        { pos: 'RB', x: 22.5, y: 80 }, 

        // Mijloc (midfielders) - Ajustat Y mai sus
        { pos: 'LM', x: 47.5, y: 10 }, 
        { pos: 'LCM', x: 47.5, y: 30 }, 
        { pos: 'RCM', x: 47.5, y: 60 }, 
        { pos: 'RM', x: 47.5, y: 80 }, 

        // Atac (forwards) - Ajustat Y mai sus (încă jumătate de cm)
        { pos: 'LS', x: 72.5, y: 30 }, // Ajustat de la 32 la 30
        { pos: 'RS', x: 72.5, y: 60 }  // Ajustat de la 62 la 60
    ],
    '4-3-3': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 10 },
        { pos: 'LCB', x: 22.5, y: 30 },
        { pos: 'RCB', x: 22.5, y: 60 },
        { pos: 'RB', x: 22.5, y: 80 },

        // Mijloc - Ajustat Y mai sus
        { pos: 'CDM', x: 47.5, y: 45 }, 
        { pos: 'LCM', x: 57.5, y: 25 }, 
        { pos: 'RCM', x: 57.5, y: 65 }, 

        // Atac - Fără modificare suplimentară (are 1 atacant central)
        { pos: 'LW', x: 77.5, y: 10 }, 
        { pos: 'ST', x: 82.5, y: 45 }, 
        { pos: 'RW', x: 77.5, y: 80 }  
    ],
    '3-5-2': [
        // Apărare (3 defenders) - Ajustat Y mai sus
        { pos: 'LCB', x: 22.5, y: 25 }, 
        { pos: 'CB', x: 17.5, y: 45 },  
        { pos: 'RCB', x: 22.5, y: 65 }, 

        // Mijloc (5 midfielders) - Ajustat Y mai sus
        { pos: 'LWB', x: 37.5, y: 10 }, 
        { pos: 'LCM', x: 52.5, y: 25 }, 
        { pos: 'CM', x: 57.5, y: 45 },  
        { pos: 'RCM', x: 52.5, y: 65 }, 
        { pos: 'RWB', x: 37.5, y: 80 }, 

        // Atac (2 forwards) - Ajustat Y mai sus (încă jumătate de cm)
        { pos: 'LS', x: 77.5, y: 30 }, // Ajustat de la 32 la 30
        { pos: 'RS', x: 77.5, y: 60 }  // Ajustat de la 62 la 60
    ],
    '4-2-3-1': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 10 },
        { pos: 'LCB', x: 22.5, y: 30 },
        { pos: 'RCB', x: 22.5, y: 60 },
        { pos: 'RB', x: 22.5, y: 80 },

        // Mijlocași defensivi (2) - Ajustat Y mai sus
        { pos: 'LDM', x: 37.5, y: 30 },
        { pos: 'RDM', x: 37.5, y: 60 },

        // Mijlocași ofensivi (3) - Ajustat Y mai sus
        { pos: 'LAM', x: 62.5, y: 20 }, 
        { pos: 'CAM', x: 67.5, y: 45 }, 
        { pos: 'RAM', x: 62.5, y: 70 }, 

        // Atacant (1) - Fără modificare suplimentară
        { pos: 'ST', x: 82.5, y: 45 }   
    ],
    '5-3-2': [
        // Apărare (5 defenders) - Ajustat Y mai sus
        { pos: 'LWB', x: 17.5, y: 12 }, 
        { pos: 'LCB', x: 22.5, y: 27 }, 
        { pos: 'CB', x: 27.5, y: 47 }, 
        { pos: 'RCB', x: 22.5, y: 67 }, 
        { pos: 'RWB', x: 17.5, y: 82 }, 

        // Mijloc (3 midfielders) - Ajustat Y mai sus
        { pos: 'LCM', x: 52.5, y: 27 },
        { pos: 'CM', x: 57.5, y: 47 },
        { pos: 'RCM', x: 52.5, y: 67 },

        // Atac (2 forwards) - Ajustat Y mai sus (încă jumătate de cm)
        { pos: 'LS', x: 77.5, y: 32 }, // Ajustat de la 34 la 32
        { pos: 'RS', x: 77.5, y: 62 }  // Ajustat de la 64 la 62
    ],
    '4-1-2-1-2': [ // Diamond
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 12 },
        { pos: 'LCB', x: 22.5, y: 32 },
        { pos: 'RCB', x: 22.5, y: 62 },
        { pos: 'RB', x: 22.5, y: 82 },

        // Mijlocaș defensiv (1) - Ajustat Y mai sus
        { pos: 'CDM', x: 37.5, y: 47 },

        // Mijlocași laterali (2) - Ajustat Y mai sus
        { pos: 'LM', x: 52.5, y: 22 },
        { pos: 'RM', x: 52.5, y: 72 },

        // Mijlocaș ofensiv (1) - Ajustat Y mai sus
        { pos: 'CAM', x: 67.5, y: 47 },

        // Atac (2 forwards) - Ajustat Y mai sus (încă jumătate de cm)
        { pos: 'LS', x: 82.5, y: 32 }, // Ajustat de la 34 la 32
        { pos: 'RS', x: 82.5, y: 62 }  // Ajustat de la 64 la 62
    ],
    '3-4-3': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LCB', x: 22.5, y: 27 },
        { pos: 'CB', x: 17.5, y: 47 },
        { pos: 'RCB', x: 22.5, y: 67 },

        // Mijloc - Ajustat Y mai sus
        { pos: 'LM', x: 47.5, y: 12 },
        { pos: 'LCM', x: 47.5, y: 32 },
        { pos: 'RCM', x: 47.5, y: 62 },
        { pos: 'RM', x: 47.5, y: 82 },

        // Atac - Fără modificare suplimentară (are 1 atacant central)
        { pos: 'LW', x: 77.5, y: 22 },
        { pos: 'ST', x: 82.5, y: 47 },
        { pos: 'RW', x: 77.5, y: 72 }
    ],
    '4-5-1': [
        // Apărare - Ajustat Y mai sus
        { pos: 'LB', x: 22.5, y: 12 },
        { pos: 'LCB', x: 22.5, y: 32 },
        { pos: 'RCB', x: 22.5, y: 62 },
        { pos: 'RB', x: 22.5, y: 82 },

        // Mijloc - Ajustat Y mai sus
        { pos: 'LDM', x: 37.5, y: 32 },
        { pos: 'CDM', x: 42.5, y: 47 },
        { pos: 'RDM', x: 37.5, y: 62 },
        { pos: 'LM', x: 52.5, y: 12 }, 
        { pos: 'RM', x: 52.5, y: 82 }, 

        // Atac - Fără modificare suplimentară (are 1 atacant central)
        { pos: 'ST', x: 82.5, y: 47 }
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
