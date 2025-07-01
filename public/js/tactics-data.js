// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Axa X: 0% = stânga (poarta noastră), 100% = dreapta (poarta adversă)
// Axa Y: 0% = sus (marginea terenului), 100% = jos (marginea terenului)

export const FORMATIONS = {
    // Portarul (GK) este poziționat central pe linia porții noastre.
    // Am ajustat X pentru a fi mai aproape de poartă și Y la 50 pentru a fi centrat vertical.
    GK: { x: 8, y: 50 }, 

    '4-4-2': [
        // Apărare (defenders) - Linia X: ~25%
        // Poziționați mai central pe lățimea terenului (Y)
        { pos: 'LB', x: 25, y: 20 }, // Fundaș Stânga
        { pos: 'LCB', x: 30, y: 40 }, // Fundaș Central Stânga
        { pos: 'RCB', x: 30, y: 60 }, // Fundaș Central Dreapta
        { pos: 'RB', x: 25, y: 80 }, // Fundaș Dreapta

        // Mijloc (midfielders) - Linia X: ~50%
        // LCM și RCM sunt poziționați simetric față de Y=50, iar linia lor X este centrată pe teren.
        { pos: 'LM', x: 50, y: 20 }, // Mijlocaș Stânga
        { pos: 'LCM', x: 55, y: 40 }, // Mijlocaș Central Stânga
        { pos: 'RCM', x: 55, y: 60 }, // Mijlocaș Central Dreapta
        { pos: 'RM', x: 50, y: 80 }, // Mijlocaș Dreapta

        // Atac (forwards) - Linia X: ~75%
        // Poziționați mai central pe lățimea terenului (Y)
        { pos: 'LS', x: 75, y: 40 }, // Atacant Stânga
        { pos: 'RS', x: 75, y: 60 }  // Atacant Dreapta
    ],
    '4-3-3': [
        // Apărare
        { pos: 'LB', x: 25, y: 20 },
        { pos: 'LCB', x: 30, y: 40 },
        { pos: 'RCB', x: 30, y: 60 },
        { pos: 'RB', x: 25, y: 80 },

        // Mijloc
        { pos: 'CDM', x: 50, y: 50 }, // Mijlocaș Defensiv Central
        { pos: 'LCM', x: 60, y: 30 }, // Mijlocaș Central Stânga
        { pos: 'RCM', x: 60, y: 70 }, // Mijlocaș Central Dreapta

        // Atac
        { pos: 'LW', x: 80, y: 20 }, // Extremă Stânga
        { pos: 'ST', x: 85, y: 50 }, // Atacant Central
        { pos: 'RW', x: 80, y: 80 }  // Extremă Dreapta
    ],
    '3-5-2': [
        // Apărare (3 defenders)
        { pos: 'LCB', x: 30, y: 30 }, 
        { pos: 'CB', x: 25, y: 50 },  
        { pos: 'RCB', x: 30, y: 70 }, 

        // Mijloc (5 midfielders)
        { pos: 'LWB', x: 45, y: 20 }, 
        { pos: 'LCM', x: 55, y: 30 }, 
        { pos: 'CM', x: 60, y: 50 },  
        { pos: 'RCM', x: 55, y: 70 }, 
        { pos: 'RWB', x: 45, y: 80 }, 

        // Atac (2 forwards)
        { pos: 'LS', x: 75, y: 40 }, 
        { pos: 'RS', x: 75, y: 60 }  
    ],
    '4-2-3-1': [
        // Apărare
        { pos: 'LB', x: 25, y: 20 },
        { pos: 'LCB', x: 30, y: 40 },
        { pos: 'RCB', x: 30, y: 60 },
        { pos: 'RB', x: 25, y: 80 },

        // Mijlocași defensivi (2)
        { pos: 'LDM', x: 45, y: 35 }, 
        { pos: 'RDM', x: 45, y: 65 }, 

        // Mijlocași ofensivi (3)
        { pos: 'LAM', x: 65, y: 25 }, 
        { pos: 'CAM', x: 70, y: 50 }, 
        { pos: 'RAM', x: 65, y: 75 }, 

        // Atacant (1)
        { pos: 'ST', x: 85, y: 50 }   
    ],
    '5-3-2': [
        // Apărare (5 defenders)
        { pos: 'LWB', x: 20, y: 15 },
        { pos: 'LCB', x: 25, y: 30 },
        { pos: 'CB', x: 30, y: 50 },
        { pos: 'RCB', x: 25, y: 70 },
        { pos: 'RWB', x: 20, y: 85 },

        // Mijloc (3 midfielders)
        { pos: 'LCM', x: 55, y: 30 },
        { pos: 'CM', x: 60, y: 50 },
        { pos: 'RCM', x: 55, y: 70 },

        // Atac (2 forwards)
        { pos: 'LS', x: 80, y: 40 },
        { pos: 'RS', x: 80, y: 60 }
    ],
    '4-1-2-1-2': [ // Diamond
        // Apărare
        { pos: 'LB', x: 25, y: 20 },
        { pos: 'LCB', x: 30, y: 40 },
        { pos: 'RCB', x: 30, y: 60 },
        { pos: 'RB', x: 25, y: 80 },

        // Mijlocaș defensiv (1)
        { pos: 'CDM', x: 45, y: 50 },

        // Mijlocași laterali (2)
        { pos: 'LM', x: 60, y: 25 },
        { pos: 'RM', x: 60, y: 75 },

        // Mijlocaș ofensiv (1)
        { pos: 'CAM', x: 70, y: 50 },

        // Atac (2 forwards)
        { pos: 'LS', x: 85, y: 40 },
        { pos: 'RS', x: 85, y: 60 }
    ],
    '3-4-3': [
        // Apărare
        { pos: 'LCB', x: 30, y: 30 },
        { pos: 'CB', x: 25, y: 50 },
        { pos: 'RCB', x: 30, y: 70 },

        // Mijloc
        { pos: 'LM', x: 50, y: 20 },
        { pos: 'LCM', x: 55, y: 40 },
        { pos: 'RCM', x: 55, y: 60 },
        { pos: 'RM', x: 50, y: 80 },

        // Atac
        { pos: 'LW', x: 80, y: 25 },
        { pos: 'ST', x: 85, y: 50 },
        { pos: 'RW', x: 80, y: 75 }
    ],
    '4-5-1': [
        // Apărare
        { pos: 'LB', x: 25, y: 20 },
        { pos: 'LCB', x: 30, y: 40 },
        { pos: 'RCB', x: 30, y: 60 },
        { pos: 'RB', x: 25, y: 80 },

        // Mijloc
        { pos: 'LDM', x: 45, y: 35 },
        { pos: 'CDM', x: 50, y: 50 },
        { pos: 'RDM', x: 45, y: 65 },
        { pos: 'LM', x: 60, y: 20 }, 
        { pos: 'RM', x: 60, y: 80 }, 

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
