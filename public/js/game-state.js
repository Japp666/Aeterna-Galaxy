// public/js/game-state.js

import { generateInitialPlayers } from './player-generator.js';

const defaultState = {
  isGameStarted: false,
  coach: { nickname: '', reputation: 0, experience: 0 },
  club: { name: '', emblemUrl: '', funds: 0, reputation: 0, facilitiesLevel: 0 },
  players: [],
  currentSeason: 1,
  currentDay: 1,
  currentFormation: '4-4-2',
  currentMentality: 'balanced',
  teamFormation: {},
  divisions: []
};

let state = { ...defaultState };

// Încarcă din LocalStorage
const saved = localStorage.getItem('gameState');
if (saved) {
  try {
    state = JSON.parse(saved);
  } catch (e) {
    console.error('game-state.js: Saved state invalid, resetting.', e);
    resetGameState();
  }
}

/** Returnează starea curentă */
export function getGameState() {
  return state;
}

/** Aplică patch şi salvează */
export function updateGameState(patch) {
  state = { ...state, ...patch };
  saveGameState();
}

/** Salvează în LocalStorage */
export function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify(state));
}

/** Şterge starea şi reload */
export function resetGameState() {
  localStorage.removeItem('gameState');
  location.reload();
}

/** Generează 10 divizii × 16 echipe */
export function generateLeagueSystem() {
  const NUM_DIV = 10;
  const TEAMS_PER_DIV = 16;
  const divisions = [];

  for (let d = 1; d <= NUM_DIV; d++) {
    const teams = [];
    for (let i = 1; i <= TEAMS_PER_DIV; i++) {
      teams.push({
        id: `D${d}-T${padNum(i)}`,
        name: `FC ${randomTeamName()}`,
        emblemUrl: `img/emblems/emblema${padNum(i)}.png`,
        players: generateInitialPlayers(20),
        stats: { played: 0, won: 0, draw: 0, lost: 0, pts: 0 }
      });
    }
    divisions.push({ level: d, teams });
  }

  return divisions;
}

/** Sortează echipele unei divizii după puncte și goal-difference */
export function calculateStandings(division) {
  return [...division.teams].sort((a, b) => {
    if (b.stats.pts !== a.stats.pts) {
      return b.stats.pts - a.stats.pts;
    }
    const gdA = a.stats.won - a.stats.lost;
    const gdB = b.stats.won - b.stats.lost;
    return gdB - gdA;
  });
}

/** Finalizează sezonul: promovează/retrogradează și resetează statistici */
export function finalizeSeason() {
  const NUM_DIV = state.divisions.length;
  const oldDivs = state.divisions;

  const promos = [];
  const relegs = [];
  oldDivs.forEach((div, idx) => {
    const teams = calculateStandings(div);
    const directP = teams.slice(0, 2);
    const playP   = teams.slice(2, 6);
    const directR = div.level === NUM_DIV ? [] : teams.slice(-2);
    const playR   = div.level === 1       ? [] : teams.slice(-6, -2);

    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
    promos[idx]  = { directP, playWinners: shuffle(playP).slice(0, 2) };
    relegs[idx]  = { directR, playLosers:  shuffle(playR).slice(0, 2) };
  });

  const newDivs = oldDivs.map((div, idx) => {
    const stayed = div.teams.filter(t =>
      !promos[idx].directP.includes(t) &&
      !promos[idx].playWinners.includes(t) &&
      !relegs[idx].directR.includes(t) &&
      !relegs[idx].playLosers.includes(t)
    );
    const fromBelow = idx + 1 < NUM_DIV
      ? [...promos[idx + 1].directP, ...promos[idx + 1].playWinners]
      : [];
    const fromAbove = idx - 1 >= 0
      ? [...relegs[idx - 1].directR, ...relegs[idx - 1].playLosers]
      : [];

    return {
      level: div.level,
      teams: [...stayed, ...fromBelow, ...fromAbove]
    };
  });

  // Reset statistici și avans sezon
  newDivs.forEach(div =>
    div.teams.forEach(team =>
      team.stats = { played: 0, won: 0, draw: 0, lost: 0, pts: 0 }
    )
  );

  state.divisions = newDivs;
  state.currentSeason += 1;
  state.currentDay = 1;
  saveGameState();
}

// --- HELPERS ---

function randomTeamName() {
  const pool = [
    'Cosmos','Stars','Galactic','Nebula',
    'Comet','Meteor','Nova','Orbit',
    'Astral','Eclipse','Pulsar','Quasar',
    'Supernova','Celestial','Solar','Lunar'
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function padNum(num) {
  return String(num).padStart(2, '0');
}
