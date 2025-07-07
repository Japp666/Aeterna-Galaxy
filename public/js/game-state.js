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

const saved = localStorage.getItem('gameState');
if (saved) {
  try {
    state = JSON.parse(saved);
  } catch (e) {
    console.error('game-state.js: Saved state invalid, resetting.', e);
    resetGameState();
  }
}

export function getGameState() {
  return state;
}

export function updateGameState(patch) {
  state = { ...state, ...patch };
  saveGameState();
}

export function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify(state));
}

export function resetGameState() {
  localStorage.removeItem('gameState');
  location.reload();
}

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
  return String(num).padStart(2, '0'); // FIX: emblema01, emblema02...
}
