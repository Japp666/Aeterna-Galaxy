// public/js/game-state.js
import { generateInitialPlayers } from './player-generator.js';

const defaultState = {
  isGameStarted: false,
  coach: { nickname:'', reputation:0, experience:0 },
  club: { name:'', emblemUrl:'', funds:0, reputation:0, facilitiesLevel:0 },
  players: [],
  currentSeason:1,
  currentDay:1,
  currentFormation:'4-4-2',
  currentMentality:'balanced',
  teamFormation:{},
  divisions:[],
  currentDivision:10
};

let state = {...defaultState};
const saved = localStorage.getItem('gameState');
if (saved) {
  try { state = JSON.parse(saved); }
  catch { localStorage.removeItem('gameState'); }
}

export function getGameState() { return state; }
export function updateGameState(p) {
  state = {...state, ...p}; saveGameState();
}
export function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify(state));
}
export function resetGameState() {
  localStorage.removeItem('gameState');
  location.reload();
}

// Round-robin schedule
function generateSchedule(teams) {
  const n = teams.length + (teams.length % 2 ? 1 : 0);
  const arr = teams.slice();
  if (arr.length % 2) arr.push(null);
  const half = arr.length/2;
  const rounds = [];
  for (let r=0; r< arr.length-1; r++) {
    const round = [];
    for (let i=0; i<half; i++) {
      const a = arr[i], b = arr[arr.length-1-i];
      if (a && b) round.push({home:a, away:b});
    }
    rounds.push(round);
    arr.splice(1,0,arr.pop());
  }
  return rounds;
}

// Team names pool
function randomTeamName() {
  const pool = ['Cosmos','Stars','Galactic','Nebula','Comet','Nova','Orbit'];
  return pool[Math.floor(Math.random()*pool.length)];
}

// League + schedule
export function generateLeagueSystem() {
  const NUM_DIV=10, TEAMS=16;
  const divs = [];
  for (let d=1; d<=NUM_DIV; d++) {
    const teams = [];
    for (let i=1; i<=TEAMS; i++) {
      const code = String(i).padStart(2,'0');
      teams.push({
        id:`D${d}-T${code}`,
        name:`FC ${randomTeamName()}`,
        emblemUrl:`img/emblems/emblema${code}.png`,
        players: generateInitialPlayers(20),
        stats:{played:0,won:0,draw:0,lost:0,pts:0}
      });
    }
    const schedule = generateSchedule(teams);
    divs.push({level:d, teams, schedule});
  }
  return divs;
}

// Standings & finalize
export function calculateStandings(div) {
  return [...div.teams].sort((a,b)=>{
    const d = b.stats.pts - a.stats.pts;
    if (d) return d;
    return (b.stats.won-b.stats.lost)-(a.stats.won-a.stats.lost);
  });
}
export function finalizeSeason() {
  // (poți adăuga promovări)
  state.currentSeason++; state.currentDay=1;
  saveGameState();
}

// Match simulation
export function simulateMatch(m) {
  const max=5, gh=Math.floor(Math.random()*(max+1)),
        ga=Math.floor(Math.random()*(max+1));
  m.home.stats.played++; m.away.stats.played++;
  if (gh>ga) { m.home.stats.won++; m.home.stats.pts+=3; m.away.stats.lost++; }
  else if (gh<ga) { m.away.stats.won++; m.away.stats.pts+=3; m.home.stats.lost++; }
  else { m.home.stats.draw++; m.away.stats.draw++; m.home.stats.pts++; m.away.stats.pts++; }
  return {gh,ga};
}
export function simulateDay() {
  const day = state.currentDay-1;
  state.divisions.forEach(div=>{
    const fx = div.schedule?.[day]||[];
    fx.forEach(simulateMatch);
  });
  state.currentDay++; saveGameState();
}
export function simulateSeason() {
  const total = state.divisions[0].schedule.length;
  while(state.currentDay<=total) simulateDay();
}
