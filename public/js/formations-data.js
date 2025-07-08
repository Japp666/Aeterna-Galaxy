// public/js/formations-data.js

// Definiţii formaţii pe teren
export const formations = {
  '4-4-2': [
    { pos:'LB', x:22.5, y:10 }, { pos:'LCB', x:22.5, y:30 },
    { pos:'RCB', x:22.5, y:60 }, { pos:'RB', x:22.5, y:80 },
    { pos:'LM', x:47.5, y:10 }, { pos:'LCM', x:47.5, y:30 },
    { pos:'RCM', x:47.5, y:60 }, { pos:'RM', x:47.5, y:80 },
    { pos:'LS', x:72.5, y:30 }, { pos:'RS', x:72.5, y:60 }
  ],
  '4-3-3': [
    { pos:'LB', x:22.5, y:10 }, { pos:'LCB', x:22.5, y:30 },
    { pos:'RCB', x:22.5, y:60 }, { pos:'RB', x:22.5, y:80 },
    { pos:'CDM', x:47.5, y:45 }, { pos:'LCM', x:57.5, y:25 },
    { pos:'RCM', x:57.5, y:65 },
    { pos:'LW', x:77.5, y:10 }, { pos:'ST', x:82.5, y:45 },
    { pos:'RW', x:77.5, y:80 }
  ],
  // adaugă şi celelalte formaţii după acelaşi model...
};

// Ajustări de poziţie pentru mentalitate
export const MENTALITY_ADJUSTMENTS = {
  attacking: { xOffset:-5, yOffset:0 },
  balanced:  { xOffset: 0, yOffset:0 },
  defensive: { xOffset: 5, yOffset:0 }
};

// Mapare prescurtare → nume complet
export const POSITION_MAP = {
  'GK':'Portar',
  'LB':'Fundaș Stânga', 'LCB':'Fundaș Central Stânga',
  'RCB':'Fundaș Central Dreapta','RB':'Fundaș Dreapta',
  'LM':'Mijlocaș Stânga','LCM':'Mijlocaș Central Stânga',
  'RCM':'Mijlocaș Central Dreapta','RM':'Mijlocaș Dreapta',
  'LS':'Atacant Stânga','RS':'Atacant Dreapta',
  'CDM':'Mijlocaș Defensiv','CAM':'Mijlocaș Ofensiv',
  'LW':'Extremă Stânga','RW':'Extremă Dreapta',
  'ST':'Atacant Central'
};
