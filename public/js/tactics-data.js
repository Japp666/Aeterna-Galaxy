// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Axa X: 0% = stânga (poarta noastră), 100% = dreapta (poarta adversă)
// Axa Y: 0% = sus (marginea terenului), 100% = jos (marginea terenului)

export const FORMATIONS = {
    // Portarul este mereu la aceeași poziție fixă
    GK: { x: 5, y: 50 }, 

    '4-4-2': [
        // Apărare (defenders) - Ajustat y mult mai sus
        { pos: 'LB', x: 20, y: 8 }, 
        { pos: 'LCB', x: 25, y: 28 }, 
        { pos: 'RCB', x: 25, y: 72 }, 
        { pos: 'RB', x: 20, y: 92 }, 

        // Mijloc (midfielders) - Ajustat y mult mai sus
        { pos: 'LM', x: 50, y: 8 }, 
        { pos: 'LCM', x: 50, y: 28 }, 
        { pos: 'RCM', x: 50, y: 72 }, 
        { pos: 'RM', x: 50, y: 92 }, 

        // Atac (forwards) - Ajustat y mult mai sus
        { pos: 'LS', x: 80, y: 40 }, 
        { pos: 'RS', x: 80, y: 60 }  
    ],
    '4-3-3': [
        // Apărare - Ajustat y mult mai sus
        { pos: 'LB', x: 20, y: 8 }, 
        { pos: 'LCB', x: 25, y: 28 }, 
        { pos: 'RCB', x: 25, y: 72 }, 
        { pos: 'RB', x: 20, y: 92 }, 

        // Mijloc
        { pos: 'CDM', x: 45, y: 50 }, 
        { pos: 'LCM', x: 60, y: 28 }, 
        { pos: 'RCM', x: 60, y: 72 }, 

        // Atac - Ajustat y mult mai sus
        { pos: 'LW', x: 80, y: 8 }, 
        { pos: 'ST', x: 85, y: 50 }, 
        { pos: 'RW', x: 80, y: 92 }  
    ],
    '3-5-2': [
        // Apărare (3 defenders) - Ajustat y mult mai sus
        { pos: 'LCB', x: 25, y: 28 }, 
        { pos: 'CB', x: 20, y: 50 },  
        { pos: 'RCB', x: 25, y: 72 }, 

        // Mijloc (5 midfielders) - Ajustat y mult mai sus
        { pos: 'LWB', x: 40, y: 8 }, 
        { pos: 'LCM', x: 55, y: 28 }, 
        { pos: 'CM', x: 60, y: 50 },  
        { pos: 'RCM', x: 55, y: 72 }, 
        { pos: 'RWB', x: 40, y: 92 }, 

        // Atac (2 forwards)
        { pos: 'LS', x: 80, y: 40 }, 
        { pos: 'RS', x: 80, y: 60 }  
    ],
    '4-2-3-1': [
        // Apărare - Ajustat y mult mai sus
        { pos: 'LB', x: 20, y: 8 },
        { pos: 'LCB', x: 25, y: 28 },
        { pos: 'RCB', x: 25, y: 72 },
        { pos: 'RB', x: 20, y: 92 },

        // Mijlocași defensivi
        { pos: 'LDM', x: 40, y: 28 }, 
        { pos: 'RDM', x: 40, y: 72 }, 

        // Mijlocași ofensivi - Ajustat y mult mai sus
        { pos: 'LAM', x: 65, y: 25 }, 
        { pos: 'CAM', x: 70, y: 50 }, 
        { pos: 'RAM', x: 65, y: 75 }, 

        // Atacant
        { pos: 'ST', x: 85, y: 50 }   
    ],
    '5-3-2': [
        // Apărare - Ajustat y mult mai sus
        { pos: 'LWB', x: 15, y: 8 },
        { pos: 'LCB', x: 20, y: 28 },
        { pos: 'CB', x: 25, y: 50 },
        { pos: 'RCB', x: 20, y: 72 },
        { pos: 'RWB', x: 15, y: 92 },

        // Mijloc
        { pos: 'LCM', x: 50, y: 28 },
        { pos: 'CM', x: 55, y: 50 },
        { pos: 'RCM', x: 50, y: 72 },

        // Atac
        { pos: 'LS', x: 80, y: 40 },
        { pos: 'RS', x: 80, y: 60 }
    ],
    '4-1-2-1-2': [ // Diamond
        // Apărare - Ajustat y mult mai sus
        { pos: 'LB', x: 20, y: 8 },
        { pos: 'LCB', x: 25, y: 28 },
        { pos: 'RCB', x: 25, y: 72 },
        { pos: 'RB', x: 20, y: 92 },

        // Mijlocaș defensiv
        { pos: 'CDM', x: 40, y: 50 },

        // Mijlocași laterali - Ajustat y mult mai sus
        { pos: 'LM', x: 55, y: 25 },
        { pos: 'RM', x: 55, y: 75 },

        // Mijlocaș ofensiv
        { pos: 'CAM', x: 70, y: 50 },

        // Atac - Ajustat y mult mai sus
        { pos: 'LS', x: 85, y: 40 },
        { pos: 'RS', x: 85, y: 60 }
    ],
    '3-4-3': [
        // Apărare - Ajustat y mult mai sus
        { pos: 'LCB', x: 25, y: 28 },
        { pos: 'CB', x: 20, y: 50 },
        { pos: 'RCB', x: 25, y: 72 },

        // Mijloc - Ajustat y mult mai sus
        { pos: 'LM', x: 45, y: 8 },
        { pos: 'LCM', x: 50, y: 28 },
        { pos: 'RCM', x: 50, y: 72 },
        { pos: 'RM', x: 45, y: 92 },

        // Atac - Ajustat y mult mai sus
        { pos: 'LW', x: 80, y: 25 },
        { pos: 'ST', x: 85, y: 50 },
        { pos: 'RW', x: 80, y: 75 }
    ],
    '4-5-1': [
        // Apărare - Ajustat y mult mai sus
        { pos: 'LB', x: 20, y: 8 },
        { pos: 'LCB', x: 25, y: 28 },
        { pos: 'RCB', x: 25, y: 72 },
        { pos: 'RB', x: 20, y: 92 },

        // Mijloc
        { pos: 'LDM', x: 40, y: 28 },
        { pos: 'CDM', x: 45, y: 50 },
        { pos: 'RDM', x: 40, y: 72 },
        { pos: 'LM', x: 55, y: 8 }, 
        { pos: 'RM', x: 55, y: 92 }, 

        // Atac
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
