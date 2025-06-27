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
        { pos: 'LB', x: 20, y: 15 }, // Fundaș Stânga
        { pos: 'LCB', x: 25, y: 35 }, // Fundaș Central Stânga
        { pos: 'RCB', x: 25, y: 65 }, // Fundaș Central Dreapta
        { pos: 'RB', x: 20, y: 85 }, // Fundaș Dreapta

        // Mijloc (midfielders)
        { pos: 'LM', x: 50, y: 15 }, // Mijlocaș Stânga
        { pos: 'LCM', x: 50, y: 35 }, // Mijlocaș Central Stânga
        { pos: 'RCM', x: 50, y: 65 }, // Mijlocaș Central Dreapta
        { pos: 'RM', x: 50, y: 85 }, // Mijlocaș Dreapta

        // Atac (forwards)
        { pos: 'LS', x: 80, y: 40 }, // Atacant Stânga
        { pos: 'RS', x: 80, y: 60 }  // Atacant Dreapta
    ],
    '4-3-3': [
        // Apărare
        { pos: 'LB', x: 20, y: 15 },
        { pos: 'LCB', x: 25, y: 35 },
        { pos: 'RCB', x: 25, y: 65 },
        { pos: 'RB', x: 20, y: 85 },

        // Mijloc
        { pos: 'CDM', x: 45, y: 50 }, // Mijlocaș Defensiv Central
        { pos: 'LCM', x: 60, y: 30 }, // Mijlocaș Central Stânga
        { pos: 'RCM', x: 60, y: 70 }, // Mijlocaș Central Dreapta

        // Atac
        { pos: 'LW', x: 80, y: 15 }, // Extremă Stânga
        { pos: 'ST', x: 85, y: 50 }, // Atacant Central
        { pos: 'RW', x: 80, y: 85 }  // Extremă Dreapta
    ],
    '3-5-2': [
        // Apărare (3 defenders)
        { pos: 'LCB', x: 25, y: 30 }, // Fundaș Central Stânga
        { pos: 'CB', x: 20, y: 50 },  // Fundaș Central
        { pos: 'RCB', x: 25, y: 70 }, // Fundaș Central Dreapta

        // Mijloc (5 midfielders)
        { pos: 'LWB', x: 40, y: 15 }, // Mijlocaș Lateral Stânga
        { pos: 'LCM', x: 55, y: 30 }, // Mijlocaș Central Stânga
        { pos: 'CM', x: 60, y: 50 },  // Mijlocaș Central
        { pos: 'RCM', x: 55, y: 70 }, // Mijlocaș Central Dreapta
        { pos: 'RWB', x: 40, y: 85 }, // Mijlocaș Lateral Dreapta

        // Atac (2 forwards)
        { pos: 'LS', x: 80, y: 40 }, // Atacant Stânga
        { pos: 'RS', x: 80, y: 60 }  // Atacant Dreapta
    ]
};

// Ajustări ale pozițiilor în funcție de mentalitate
// Aceste valori vor fi adăugate/scăzute din coordonatele X ale jucătorilor.
// 'attacking': jucătorii se deplasează mai mult spre poarta adversă (X crește)
// 'balanced': nicio ajustare
// 'defensive': jucătorii se deplasează mai mult spre propria poartă (X scade)
export const MENTALITY_ADJUSTMENTS = {
    attacking: { xOffset: 8, yOffset: 0 }, // Mișcă jucătorii cu 8% mai spre înainte
    balanced: { xOffset: 0, yOffset: 0 },
    defensive: { xOffset: -8, yOffset: 0 } // Mișcă jucătorii cu 8% mai spre înapoi
};

// Maparea pozițiilor scurte la poziții complete pentru afișare
export const POSITION_MAP = {
    'GK': 'Portar',
    'LB': 'Fundaș Stânga', 'LCB': 'Fundaș Central Stânga', 'RCB': 'Fundaș Central Dreapta', 'RB': 'Fundaș Dreapta',
    'LWB': 'Fundaș Lateral Stânga', 'RWB': 'Fundaș Lateral Dreapta',
    'LM': 'Mijlocaș Stânga', 'LCM': 'Mijlocaș Central Stânga', 'RCM': 'Mijlocaș Central Dreapta', 'RM': 'Mijlocaș Dreapta',
    'CDM': 'Mijlocaș Defensiv', 'CM': 'Mijlocaș Central', 'CAM': 'Mijlocaș Ofensiv',
    'LW': 'Extremă Stânga', 'ST': 'Atacant Central', 'RW': 'Extremă Dreapta',
    'LS': 'Atacant Stânga', 'RS': 'Atacant Dreapta'
};
