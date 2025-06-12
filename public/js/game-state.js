export let gameState = {
  coach: { name: '' },
  club: { 
    name: '', 
    emblem: '', 
    budget: 100000, 
    energy: 500, 
    division: 6,
    fans: 1000,
    facilities: {
      stadium: { level: 1, capacity: 5000, cost: 500000 },
      training: { level: 1, effect: 2, cost: 300000 },
      academy: { level: 1, youthRating: 50, cost: 200000 },
      recovery: { level: 1, recovery: 5, cost: 200000 }
    }
  },
  players: [],
  teams: [],
  transferMarket: [],
  matches: [],
  standings: [],
  season: {
    currentDay: 1,
    currentWeek: 1,
    phase: 'regular', // regular, play-off, play-out, offseason
    daysUntilNextMatch: 2.27,
    offseasonDays: 0,
    activitiesUsed: 0
  },
  gameDate: new Date('2025-09-01')
};

// Salvare/stocare
export function saveGame() {
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

export function loadGame() {
  const saved = localStorage.getItem('gameState');
  if (saved) {
    gameState = JSON.parse(saved);
    gameState.gameDate = new Date(gameState.gameDate);
  }
}

export function resetGame() {
  localStorage.removeItem('gameState');
  gameState = { ...gameState }; // Reset la default
}
