export let persistentState = {
  coach: { name: '' },
  club: { 
    name: '', 
    emblemSeed: '', // Seed în loc de SVG base64
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

export let transientState = {
  teams: [],
  transferMarket: [],
  matches: [],
  standings: []
};

// Combinăm state-urile pentru acces facil
export const gameState = {
  ...persistentState,
  ...transientState,
  get club() { return persistentState.club; },
  get coach() { return persistentState.coach; },
  get players() { return persistentState.players; },
  get season() { return persistentState.season; },
  get gameDate() { return persistentState.gameDate; },
  set gameDate(value) { persistentState.gameDate = value; }
};

// Salvare doar persistentState
export function saveGame() {
  try {
    localStorage.setItem('gameState', JSON.stringify(persistentState));
  } catch (e) {
    console.error('Failed to save game:', e);
    throw e;
  }
}

// Încărcare și regenerare transientState
export function loadGame() {
  const saved = localStorage.getItem('gameState');
  if (saved) {
    persistentState = JSON.parse(saved);
    persistentState.gameDate = new Date(persistentState.gameDate);
    // Regenerăm transientState
    transientState.teams = generateAITeams();
    transientState.transferMarket = Array.from({ length: 40 }, () => generatePlayer(persistentState.club.division));
    transientState.matches = generateSchedule();
    transientState.standings = transientState.teams
      .filter(t => t.division === persistentState.club.division)
      .map(t => ({ ...t, points: 0, goalsScored: 0, goalsConceded: 0 }))
      .concat([{
        name: persistentState.club.name,
        division: persistentState.club.division,
        emblem: generateEmblem(persistentState.club.name, persistentState.club.division, persistentState.club.emblemSeed),
        points: 0,
        goalsScored: 0,
        goalsConceded: 0
      }]);
  }
}

export function resetGame() {
  localStorage.removeItem('gameState');
  persistentState = { ...persistentState }; // Reset la default
  transientState.teams = [];
  transientState.transferMarket = [];
  transientState.matches = [];
  transientState.standings = [];
}

// Funcții utilitare importate ulterior
import { generatePlayer } from './utils.js';
import { generateEmblem, generateTeamName } from './utils.js';

function generateAITeams() {
  const teams = [];
  for (let div = 1; div <= 6; div++) {
    const numTeams = div === 6 ? 31 : 15; // 32 - 1 sau 16 - 1
    for (let i = 0; i < numTeams; i++) {
      const name = generateTeamName();
      if (name !== persistentState.club.name) {
        teams.push({
          name,
          division: div,
          emblem: generateEmblem(name, div),
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

function generateSchedule() {
  const teams = transientState.teams
    .filter(t => t.division === persistentState.club.division)
    .concat([{ name: persistentState.club.name, emblem: generateEmblem(persistentState.club.name, persistentState.club.division, persistentState.club.emblemSeed) }]);
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({ home: teams[i], away: teams[j], date: null, phase: 'regular' });
      matches.push({ home: teams[j], away: teams[i], phase: 'regular' });
    }
  }
  return matches.sort(() => Math.random() - 0.5);
}

function getBudgetForDivision(div) {
  return [50000000, 20000000, 10000000, 5000000, 1000000, 100000][div - 1] || 100000;
}
