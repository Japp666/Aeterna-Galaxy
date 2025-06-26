// public/js/formations-data.js
// Definiții pentru formații și pozițiile lor aproximative pe teren (în procente)
// Coordonatele sunt pentru un teren ORIZONTAL (Landscape)

export const formations = {
    '4-4-2': { // Echilibrat
        GK: 1, DF: 4, MF: 4, AT: 2,
        layout: {
            GK: [{ top: '50%', left: '90%', type: 'GK' }], // Portar
            DF: [ // Fundași
                { top: '25%', left: '75%', type: 'DR' },  // Fundaș Dreapta
                { top: '40%', left: '70%', type: 'DC' },  // Fundaș Central
                { top: '60%', left: '70%', type: 'DC' },  // Fundaș Central
                { top: '75%', left: '75%', type: 'DL' }   // Fundaș Stânga
            ],
            MF: [ // Mijlocași
                { top: '20%', left: '45%', type: 'MR' },  // Mijlocaș Dreapta
                { top: '40%', left: '40%', type: 'MC' },  // Mijlocaș Central
                { top: '60%', left: '40%', type: 'MC' },  // Mijlocaș Central
                { top: '80%', left: '45%', type: 'ML' }   // Mijlocaș Stânga
            ],
            AT: [ // Atacanți
                { top: '40%', left: '15%', type: 'ST' },  // Atacant Central
                { top: '60%', left: '15%', type: 'ST' }   // Atacant Central
            ]
        },
        // Offset-uri pentru mentalitate (procent din lățimea terenului)
        // Valorile pozitive deplasează spre dreapta (spre apărare)
        // Valorile negative deplasează spre stânga (spre atac)
        mentality_offsets: {
            normal: { GK: 0, DF: 0, MF: 0, AT: 0 },
            attacking: { GK: 0, DF: -2, MF: -5, AT: -8 }, 
            defensive: { GK: 0, DF: 5, MF: 2, AT: 0 }    
        }
    },
    '4-3-3': { // Ofensiv
        GK: 1, DF: 4, MF: 3, AT: 3,
        layout: {
            GK: [{ top: '50%', left: '90%', type: 'GK' }],
            DF: [
                { top: '25%', left: '75%', type: 'DR' }, { top: '40%', left: '70%', type: 'DC' }, { top: '60%', left: '70%', type: 'DC' }, { top: '75%', left: '75%', type: 'DL' }
            ],
            MF: [
                { top: '30%', left: '50%', type: 'MC' }, { top: '50%', left: '45%', type: 'DM' }, { top: '70%', left: '50%', type: 'MC' }
            ],
            AT: [
                { top: '20%', left: '20%', type: 'RW' }, { top: '50%', left: '10%', type: 'ST' }, { top: '80%', left: '20%', type: 'LW' }
            ]
        },
        mentality_offsets: {
            normal: { GK: 0, DF: 0, MF: 0, AT: 0 },
            attacking: { GK: 0, DF: -2, MF: -5, AT: -8 },
            defensive: { GK: 0, DF: 5, MF: 2, AT: 0 }
        }
    },
    '3-5-2': { // Mijlociu aglomerat
        GK: 1, DF: 3, MF: 5, AT: 2,
        layout: {
            GK: [{ top: '50%', left: '90%', type: 'GK' }],
            DF: [
                { top: '25%', left: '78%', type: 'DC' }, { top: '50%', left: '75%', type: 'DC' }, { top: '75%', left: '78%', type: 'DC' }
            ],
            MF: [
                { top: '10%', left: '55%', type: 'RWB' }, { top: '30%', left: '45%', type: 'MC' }, { top: '50%', left: '35%', type: 'AM' }, { top: '70%', left: '45%', type: 'MC' }, { top: '90%', left: '55%', type: 'LWB' }
            ],
            AT: [
                { top: '40%', left: '15%', type: 'ST' }, { top: '60%', left: '15%', type: 'ST' }
            ]
        },
        mentality_offsets: {
            normal: { GK: 0, DF: 0, MF: 0, AT: 0 },
            attacking: { GK: 0, DF: -2, MF: -5, AT: -8 },
            defensive: { GK: 0, DF: 5, MF: 2, AT: 0 }
        }
    },
    '5-3-2': { // Defensiv
        GK: 1, DF: 5, MF: 3, AT: 2,
        layout: {
            GK: [{ top: '50%', left: '90%', type: 'GK' }],
            DF: [
                { top: '10%', left: '80%', type: 'DR' }, { top: '30%', left: '75%', type: 'DC' }, { top: '50%', left: '70%', type: 'SW' }, { top: '70%', left: '75%', type: 'DC' }, { top: '90%', left: '80%', type: 'DL' } // SW = Sweeper
            ],
            MF: [
                { top: '30%', left: '45%', type: 'DM' }, { top: '50%', left: '40%', type: 'MC' }, { top: '70%', left: '45%', type: 'DM' }
            ],
            AT: [
                { top: '40%', left: '15%', type: 'ST' }, { top: '60%', left: '15%', type: 'ST' }
            ]
        },
        mentality_offsets: {
            normal: { GK: 0, DF: 0, MF: 0, AT: 0 },
            attacking: { GK: 0, DF: -2, MF: -5, AT: -8 },
            defensive: { GK: 0, DF: 5, MF: 2, AT: 0 }
        }
    },
    '4-2-3-1': { // Agresiv, cu mijlocaș ofensiv (2 DM, 1 AM, 1 ST)
        GK: 1, DF: 4, MF: 3, AT: 1,
        layout: {
            GK: [{ top: '50%', left: '90%', type: 'GK' }],
            DF: [
                { top: '25%', left: '75%', type: 'DR' }, { top: '40%', left: '70%', type: 'DC' }, { top: '60%', left: '70%', type: 'DC' }, { top: '75%', left: '75%', type: 'DL' }
            ],
            MF: [
                { top: '30%', left: '55%', type: 'DM' }, { top: '70%', left: '55%', type: 'DM'}, { top: '50%', left: '35%', type: 'AM' } 
            ],
            AT: [{ top: '50%', left: '10%', type: 'ST' }]
        },
        mentality_offsets: {
            normal: { GK: 0, DF: 0, MF: 0, AT: 0 },
            attacking: { GK: 0, DF: -2, MF: -5, AT: -8 },
            defensive: { GK: 0, DF: 5, MF: 2, AT: 0 }
        }
    },
    '4-1-2-1-2': { // Diamant, posesie (1 DM, 2 Central MF, 1 AM, 2 ST)
        GK: 1, DF: 4, MF: 4, AT: 2,
        layout: {
            GK: [{ top: '50%', left: '90%', type: 'GK' }],
            DF: [
                { top: '25%', left: '75%', type: 'DR' }, { top: '40%', left: '70%', type: 'DC' }, { top: '60%', left: '70%', type: 'DC' }, { top: '75%', left: '75%', type: 'DL' }
            ],
            MF: [
                { top: '50%', left: '60%', type: 'DM' }, // DM
                { top: '30%', left: '40%', type: 'MC' }, { top: '70%', left: '40%', type: 'MC' }, // Central MF
                { top: '50%', left: '25%', type: 'AM' } // AM
            ],
            AT: [
                { top: '40%', left: '10%', type: 'ST' }, { top: '60%', left: '10%', type: 'ST' }
            ]
        },
        mentality_offsets: {
            normal: { GK: 0, DF: 0, MF: 0, AT: 0 },
            attacking: { GK: 0, DF: -2, MF: -5, AT: -8 },
            defensive: { GK: 0, DF: 5, MF: 2, AT: 0 }
        }
    }
};

// Maparea pozițiilor generale la poziții detaliate pentru generarea jucătorilor
export const detailedPositionsMap = {
    GK: ['GK'],
    DF: ['DL', 'DC', 'DR', 'SW'], // SW for Sweeper, for tactical variety
    MF: ['ML', 'MC', 'MR', 'DM', 'AM', 'LWB', 'RWB'], // DM = Defensive Mid, AM = Attacking Mid, LWB/RWB = Wing-back
    AT: ['ST', 'LW', 'RW'] // ST = Striker, LW/RW = Wingers
};

// Atribute cheie pentru fiecare poziție (folosite pentru generarea echilibrată și afișare)
export const positionAttributes = {
    GK: ['goalkeeping', 'reflexes', 'handling', 'positioning'],
    DF: ['tackling', 'marking', 'strength', 'heading', 'positioning'],
    MF: ['passing', 'dribbling', 'vision', 'stamina', 'tackling'],
    AT: ['finishing', 'shooting', 'dribbling', 'pace', 'attack']
};
