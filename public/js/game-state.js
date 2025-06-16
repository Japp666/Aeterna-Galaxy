export let gameState = JSON.parse(localStorage.getItem('gameState')) || {
  coach: null,
  club: null,
  players: [],
  season: {
    phase: 'regular',
    currentDay: 1,
    offseasonDays: 0,
    activitiesUsed: 0,
    teams: [],
    matches: [],
    standings: [],
    currentMatchDay: 1,
  },
  gameDate: new Date(2025, 0, 1),
};

if (typeof gameState.gameDate === 'string') {
  gameState.gameDate = new Date(gameState.gameDate);
}
if (!(gameState.gameDate instanceof Date) || isNaN(gameState.gameDate)) {
  gameState.gameDate = new Date(2025, 0, 1);
}

export function saveGame() {
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

export function initializeGame() {
  if (!gameState.players || gameState.players.length === 0) {
    gameState.players = generateInitialPlayers();
  }
  saveGame();
}

function generateInitialPlayers() {
  const positions = ['Portar', 'Fundaș', 'Mijlocaș', 'Atacant'];
  const names = [
    'Ion Popescu', 'Mihai Ionescu', 'Andrei Georgescu', 'Cristian Vasilescu',
    'Alexandru Dumitru', 'Gabriel Marin', 'Razvan Stoica', 'Florin Radu',
    'Bogdan Neagu', 'Vlad Munteanu',
  ];
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    position: positions[Math.floor(Math.random() * positions.length)],
    rating: Math.floor(Math.random() * 20) + 50,
    stamina: Math.floor(Math.random() * 20) + 70,
    morale: Math.floor(Math.random() * 20) + 60,
    salary: Math.floor(Math.random() * 5000) + 10000,
    contractYears: Math.floor(Math.random() * 3) + 1,
  }));
}
