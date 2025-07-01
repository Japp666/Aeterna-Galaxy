// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Baza: Grila de 20x20 celule, unde fiecare celulă are 5% lățime/înălțime.
// Pozițiile "pe linia dintre X/Y și X/Y+1" înseamnă că Y este la (Y * 5)%.
// Pozițiile "la intersectia casutelor X/Y" înseamnă că X este la ((X-1)*5 + 2.5)%.

export const FORMATIONS = {
    // Portarul este mereu la aceeași poziție fixă, conform indicațiilor: 2/10, 2/11 -> X: 7.5, Y: 50
    GK: { x: 7.5, y: 50 }, 

    '4-4-2': [
        // Apărare (defenders) - Coloana 5 (X: 22.5%)
        { pos: 'LB', x: 22.5, y: 15 }, // Fundaș Stânga (între 5/3 și 5/4)
        { pos: 'LCB', x: 22.5, y: 35 }, // Fundaș Central Stânga (între 5/7 și 5/8)
        { pos: 'RCB', x: 22.5, y: 65 }, // Fundaș Central Dreapta (între 5/13 și 5/14)
        { pos: 'RB', x: 22.5, y: 85 }, // Fundaș Dreapta (între 5/17 și 5/18)

        // Mijloc (midfielders) - Coloana 10 (X: 47.5%)
        { pos: 'LM', x: 47.5, y: 15 }, // Mijlocaș Stânga (între 10/3 și 10/4)
        { pos: 'LCM', x: 47.5, y: 35 }, // Mijlocaș Central Stânga (între 10/7 și 10/8)
        { pos: 'RCM', x: 47.5, y: 65 }, // Mijlocaș Central Dreapta (între 10/13 și 10/14)
        { pos: 'RM', x: 47.5, y: 85 }, // Mijlocaș Dreapta (între 10/17 și 10/18)

        // Atac (forwards) - Coloana 15 (X: 72.5%)
        { pos: 'LS', x: 72.5, y: 35 }, // Atacant Stânga (între 15/7 și 15/8)
        { pos: 'RS', x: 72.5, y: 65 }  // Atacant Dreapta (între 15/13 și 15/14)
    ],
    '4-3-3': [
        // Apărare - X: 22.5%
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        // Mijloc - X: 47.5% (ajustat pentru 3 jucători)
        { pos: 'CDM', x: 47.5, y: 50 }, // Central defensiv
        { pos: 'LCM', x: 57.5, y: 30 }, // Mijlocaș central stânga (mai avansat)
        { pos: 'RCM', x: 57.5, y: 70 }, // Mijlocaș central dreapta (mai avansat)

        // Atac - X: 72.5% (ajustat pentru 3 jucători)
        { pos: 'LW', x: 77.5, y: 15 }, // Extremă Stânga
        { pos: 'ST', x: 82.5, y: 50 }, // Atacant Central
        { pos: 'RW', x: 77.5, y: 85 }  // Extremă Dreapta
    ],
    '3-5-2': [
        // Apărare (3 defenders) - X: 22.5%
        { pos: 'LCB', x: 22.5, y: 30 }, 
        { pos: 'CB', x: 17.5, y: 50 },  
        { pos: 'RCB', x: 22.5, y: 70 }, 

        // Mijloc (5 midfielders) - X: 47.5% (ajustat pentru 5 jucători)
        { pos: 'LWB', x: 37.5, y: 15 }, 
        { pos: 'LCM', x: 52.5, y: 30 }, 
        { pos: 'CM', x: 57.5, y: 50 },  
        { pos: 'RCM', x: 52.5, y: 70 }, 
        { pos: 'RWB', x: 37.5, y: 85 }, 

        // Atac (2 forwards) - X: 72.5%
        { pos: 'LS', x: 77.5, y: 40 }, 
        { pos: 'RS', x: 77.5, y: 60 }  
    ],
    '4-2-3-1': [
        // Apărare - X: 22.5%
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        // Mijlocași defensivi (2) - X: 37.5%
        { pos: 'LDM', x: 37.5, y: 35 }, 
        { pos: 'RDM', x: 37.5, y: 65 }, 

        // Mijlocași ofensivi (3) - X: 62.5%
        { pos: 'LAM', x: 62.5, y: 25 }, 
        { pos: 'CAM', x: 67.5, y: 50 }, 
        { pos: 'RAM', x: 62.5, y: 75 }, 

        // Atacant (1) - X: 82.5%
        { pos: 'ST', x: 82.5, y: 50 }   
    ],
    '5-3-2': [
        // Apărare (5 defenders) - X: 17.5% (mai defensiv)
        { pos: 'LWB', x: 17.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 30 },
        { pos: 'CB', x: 27.5, y: 50 },
        { pos: 'RCB', x: 22.5, y: 70 },
        { pos: 'RWB', x: 17.5, y: 85 },

        // Mijloc (3 midfielders) - X: 52.5%
        { pos: 'LCM', x: 52.5, y: 30 },
        { pos: 'CM', x: 57.5, y: 50 },
        { pos: 'RCM', x: 52.5, y: 70 },

        // Atac (2 forwards) - X: 77.5%
        { pos: 'LS', x: 77.5, y: 40 },
        { pos: 'RS', x: 77.5, y: 60 }
    ],
    '4-1-2-1-2': [ // Diamond
        // Apărare - X: 22.5%
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        // Mijlocaș defensiv (1) - X: 37.5%
        { pos: 'CDM', x: 37.5, y: 50 },

        // Mijlocași laterali (2) - X: 52.5%
        { pos: 'LM', x: 52.5, y: 25 },
        { pos: 'RM', x: 52.5, y: 75 },

        // Mijlocaș ofensiv (1) - X: 67.5%
        { pos: 'CAM', x: 67.5, y: 50 },

        // Atac (2 forwards) - X: 82.5%
        { pos: 'LS', x: 82.5, y: 40 },
        { pos: 'RS', x: 82.5, y: 60 }
    ],
    '3-4-3': [
        // Apărare (3 defenders) - X: 22.5%
        { pos: 'LCB', x: 22.5, y: 30 },
        { pos: 'CB', x: 17.5, y: 50 },
        { pos: 'RCB', x: 22.5, y: 70 },

        // Mijloc (4 midfielders) - X: 47.5%
        { pos: 'LM', x: 47.5, y: 15 },
        { pos: 'LCM', x: 47.5, y: 35 },
        { pos: 'RCM', x: 47.5, y: 65 },
        { pos: 'RM', x: 47.5, y: 85 },

        // Atac (3 forwards) - X: 77.5%
        { pos: 'LW', x: 77.5, y: 25 },
        { pos: 'ST', x: 82.5, y: 50 },
        { pos: 'RW', x: 77.5, y: 75 }
    ],
    '4-5-1': [
        // Apărare - X: 22.5%
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        // Mijloc (5 midfielders) - X: 47.5% (ajustat pentru 5 jucători)
        { pos: 'LDM', x: 37.5, y: 30 },
        { pos: 'CDM', x: 42.5, y: 50 },
        { pos: 'RDM', x: 37.5, y: 70 },
        { pos: 'LM', x: 52.5, y: 15 }, 
        { pos: 'RM', x: 52.5, y: 85 }, 

        // Atac (1 forward) - X: 82.5%
        { pos: 'ST', x: 82.5, y: 50 }
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
