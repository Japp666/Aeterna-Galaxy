import { generatePlayer, generateTeamName, generateEmblemParams, generateEmblemFromParams } from './utils.js';

export let gameState = {
  coach: { name: '' },
  club: { 
    name: '', 
    emblemParams: null, // Stocăm parametrii emblemei, nu SVG
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
  teams: [], // Nu salvăm echipele AI, le regenerăm
  transferMarket: [],
  matches: [],
  standings: [],
  season: {
    currentDay: 1,
    currentWeek: 1,
    phase: 'regular',
    daysUntilNextMatch: 2.27,
    offseasonDays: 0,
    activitiesUsed: 0
  },
  gameDate: new Date('2025-09-01')
};

// Salvare doar date esențiale
export function saveGame() {
  const minimalState = {
    coach: gameState.coach,
    club: {
      name: gameState.club.name,
      emblemParams: gameState.club.emblemParams,
      budget: gameState.club.budget,
      energy: gameState.club.energy,
      division: gameState.club.division,
      fans: gameState.club.fans,
      facilities: gameState.club.facilities
    },
    players: gameState.players,
    transferMarket: gameState.transferMarket,
    matches: gameState.matches,
    standings: gameState.standings.map(({ name, points, goalsScored, goalsConceded }) => ({
      name,
      points,
      goalsScored,
      goalsConceded
    })),
    season: gameState.season,
    gameDate: gameState.gameDate.toISOString()
  };
  try {
    localStorage.setItem('gameState', JSON.stringify(minimalState));
  } catch (e) {
    console.error('Failed to save game:', e);
    throw e;
  }
}

export function loadGame() {
  const saved = localStorage.getItem('gameState');
  if (saved) {
    const loadedState = JSON.parse(saved);
    gameState.coach = loadedState.coach || gameState.coach;
    gameState.club = { ...gameState.club, ...loadedState.club };
    gameState.players = loadedState.players || [];
    gameState.transferMarket = loadedState.transferMarket || [];
    gameState.matches = loadedState.matches || [];
    gameState.standings = loadedState.standings || [];
    gameState.season = loadedState.season || gameState.season;
    gameState.gameDate = new Date(loadedState.gameDate || gameState.gameDate);
    // Regenerăm echipe AI
    if (!gameState.teams.length) {
      gameState.teams = generateAITeams();
    }
    // Regenerăm emblema din parametrii
    if (gameState.club.emblemParams) {
      gameState.club.emblem = generateEmblemFromParams(gameState.club.emblemParams);
    }
  }
}

export function resetGame() {
  localStorage.removeItem('gameState');
  gameState = { ...gameState };
}

function generateAITeams() {
  const teams = [];
  for (let div = 1; div <= 6; div++) {
    const numTeams = div === 6 ? 32 : 16;
    for (let i = 0; i < numTeams; i++) {
      const name = generateTeamName();
      if (name !== gameState.club.name) {
        teams.push({
          name,
          division: div,
          emblem: generateEmblemFromParams(generateEmblemParams(name, div)),
          players: Array.from({ length: 18 }, () => generatePlayer(div)),
          budget: getBudgetForDivision(div),
          points: 0,
          goalsScored: 0,
          goalsConceded: 0
        });
      }
    }
  }
  return teams;
}

function getBudgetForDivision(div) {
  return [50000000, 20000000, 10000000, 5000000, 1000000, 100000][div - 1] || 100000;
}
