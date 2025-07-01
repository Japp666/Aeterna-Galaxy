// public/js/tactics-data.js

// Definirea pozițiilor standard pentru diferite formații pe terenul de fotbal
// Coordonatele sunt procentuale (0-100) pentru a asigura responsivitatea.
// Axa X: 0% = stânga (poarta noastră), 100% = dreapta (poarta adversă)
// Axa Y: 0% = sus (marginea terenului), 100% = jos (marginea terenului)
// Coordonatele sunt calculate pe baza unei grile de 20x20 celule, unde fiecare celulă are 5% lățime/înălțime.
// "pe linia dintre X/Y și X/Y+1" înseamnă că Y-ul este la (Y * 5)%.
// "la intersectia casutelor X/Y, X/Y+1" înseamnă că Y-ul este la (Y * 5)%.
// X-ul pentru o coloană N este (N-1)*5 + 2.5% (centrul celulei N).

export const FORMATIONS = {
    // Portarul este mereu la aceeași poziție fixă, conform indicațiilor:
    // "Portar la intersectia casutelor 2/10, 2/11 fix pe linia dintre ele"
    // X: Centrul coloanei 2 = (2-1)*5 + 2.5 = 7.5%
    // Y: Pe linia dintre rândul 10 și 11 = 10 * 5 = 50%
    GK: { x: 7.5, y: 50 }, 

    '4-4-2': [
        // Apărare (defenders) - Toți pe X: (5-1)*5 + 2.5 = 22.5%
        // "fundas stanga pe linia dintre 5/3 si 5/4" -> Y: 3 * 5 = 15%
        { pos: 'LB', x: 22.5, y: 15 }, 
        // "fundas central pe linia dintre 5/7 si 5/8" -> Y: 7 * 5 = 35%
        { pos: 'LCB', x: 22.5, y: 35 }, 
        // "fundas central pe linia dintre 5/13 si 5/14" -> Y: 13 * 5 = 65%
        { pos: 'RCB', x: 22.5, y: 65 }, 
        // "fundas dreapta pe linia dintre 5/17 si 5/18" -> Y: 17 * 5 = 85%
        { pos: 'RB', x: 22.5, y: 85 }, 

        // Mijloc (midfielders) - Toți pe X: (10-1)*5 + 2.5 = 47.5%
        // "mijlocas stanga pe linia dintre 10/3 si 10/4" -> Y: 3 * 5 = 15%
        { pos: 'LM', x: 47.5, y: 15 }, 
        // "mijlocas central pe linia dintre 10/7 si 10/8" -> Y: 7 * 5 = 35%
        { pos: 'LCM', x: 47.5, y: 35 }, 
        // "mijlocas central pe linia dintre 10/13 si 10/14" -> Y: 13 * 5 = 65%
        { pos: 'RCM', x: 47.5, y: 65 }, 
        // "mijlocas dreapta pe linia dintre 10/17 si 10/18" -> Y: 17 * 5 = 85%
        { pos: 'RM', x: 47.5, y: 85 }, 

        // Atac (forwards) - Toți pe X: (15-1)*5 + 2.5 = 72.5%
        // "atacant pe linia dintre 15/7 si 15/8" -> Y: 7 * 5 = 35%
        { pos: 'LS', x: 72.5, y: 35 }, 
        // "atacant pe linia dintre 15/13 si 15/14" -> Y: 13 * 5 = 65%
        { pos: 'RS', x: 72.5, y: 65 }  
    ],
    // Extrapolăm celelalte formații bazându-ne pe pozițiile exacte din 4-4-2
    '4-3-3': [
        // Apărare - Similar cu 4-4-2
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        // Mijloc - ajustat pentru 3 jucători, menținând distanțe relative
        { pos: 'CDM', x: 47.5, y: 50 }, // Central defensiv
        { pos: 'LCM', x: 57.5, y: 30 }, // Mijlocaș central stânga (mai avansat)
        { pos: 'RCM', x: 57.5, y: 70 }, // Mijlocaș central dreapta (mai avansat)

        // Atac - ajustat pentru 3 jucători, menținând distanțe relative
        { pos: 'LW', x: 77.5, y: 15 }, // Extremă Stânga
        { pos: 'ST', x: 82.5, y: 50 }, // Atacant Central
        { pos: 'RW', x: 77.5, y: 85 }  // Extremă Dreapta
    ],
    '3-5-2': [
        // Apărare (3 defenders) - ajustat
        { pos: 'LCB', x: 22.5, y: 30 }, 
        { pos: 'CB', x: 17.5, y: 50 },  
        { pos: 'RCB', x: 22.5, y: 70 }, 

        // Mijloc (5 midfielders) - ajustat
        { pos: 'LWB', x: 37.5, y: 15 }, 
        { pos: 'LCM', x: 52.5, y: 30 }, 
        { pos: 'CM', x: 57.5, y: 50 },  
        { pos: 'RCM', x: 52.5, y: 70 }, 
        { pos: 'RWB', x: 37.5, y: 85 }, 

        // Atac (2 forwards) - similar cu 4-4-2
        { pos: 'LS', x: 77.5, y: 40 }, 
        { pos: 'RS', x: 77.5, y: 60 }  
    ],
    '4-2-3-1': [
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        { pos: 'LDM', x: 37.5, y: 35 }, 
        { pos: 'RDM', x: 37.5, y: 65 }, 

        { pos: 'LAM', x: 62.5, y: 25 }, 
        { pos: 'CAM', x: 67.5, y: 50 }, 
        { pos: 'RAM', x: 62.5, y: 75 }, 

        { pos: 'ST', x: 82.5, y: 50 }   
    ],
    '5-3-2': [
        { pos: 'LWB', x: 17.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 30 },
        { pos: 'CB', x: 27.5, y: 50 },
        { pos: 'RCB', x: 22.5, y: 70 },
        { pos: 'RWB', x: 17.5, y: 85 },

        { pos: 'LCM', x: 52.5, y: 30 },
        { pos: 'CM', x: 57.5, y: 50 },
        { pos: 'RCM', x: 52.5, y: 70 },

        { pos: 'LS', x: 77.5, y: 40 },
        { pos: 'RS', x: 77.5, y: 60 }
    ],
    '4-1-2-1-2': [ // Diamond
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        { pos: 'CDM', x: 37.5, y: 50 },

        { pos: 'LM', x: 52.5, y: 25 },
        { pos: 'RM', x: 52.5, y: 75 },

        { pos: 'CAM', x: 67.5, y: 50 },

        { pos: 'LS', x: 82.5, y: 40 },
        { pos: 'RS', x: 82.5, y: 60 }
    ],
    '3-4-3': [
        { pos: 'LCB', x: 22.5, y: 30 },
        { pos: 'CB', x: 17.5, y: 50 },
        { pos: 'RCB', x: 22.5, y: 70 },

        { pos: 'LM', x: 47.5, y: 15 },
        { pos: 'LCM', x: 47.5, y: 35 },
        { pos: 'RCM', x: 47.5, y: 65 },
        { pos: 'RM', x: 47.5, y: 85 },

        { pos: 'LW', x: 77.5, y: 25 },
        { pos: 'ST', x: 82.5, y: 50 },
        { pos: 'RW', x: 77.5, y: 75 }
    ],
    '4-5-1': [
        { pos: 'LB', x: 22.5, y: 15 },
        { pos: 'LCB', x: 22.5, y: 35 },
        { pos: 'RCB', x: 22.5, y: 65 },
        { pos: 'RB', x: 22.5, y: 85 },

        { pos: 'LDM', x: 37.5, y: 35 },
        { pos: 'CDM', x: 42.5, y: 50 },
        { pos: 'RDM', x: 37.5, y: 65 },
        { pos: 'LM', x: 52.5, y: 15 }, 
        { pos: 'RM', x: 52.5, y: 85 }, 

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
