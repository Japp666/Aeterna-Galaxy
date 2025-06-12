import { gameState, saveGame } from './game-state.js';
import { showMessage, loadComponent } from './main.js';
import { refreshMarket } from './transfers.js';
import { updateStandings } from './standings.js';
import { generatePlayer, generateEmblemFromParams, generateEmblemParams } from './utils.js';

export function initializeSeason() {
  gameState.matches = generateSchedule();
  gameState.standings = gameState.teams
    .filter(t => t.division === gameState.club.division)
    .map(t => ({ 
      name: t.name, 
      emblem: t.emblem, 
      points: 0, 
      goalsScored: 0, 
      goalsConceded: 0 
    }));
  gameState.standings.push({
    name: gameState.club.name,
    division: gameState.club.division,
    emblem: gameState.club.emblem,
    points: 0,
    goalsScored: 0,
    goalsConceded: 0
  });
  saveGame();
}

function generateSchedule() {
  const teams = gameState.teams
    .filter(t => t.division === gameState.club.division)
    .concat([{ name: gameState.club.name, emblem: gameState.club.emblem }]);
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({ home: teams[i], away: teams[j], date: null, phase: 'regular' });
      matches.push({ home: teams[j], away: teams[i], phase: 'regular' });
    }
  }
  return matches.sort(() => Math.random() - 0.5);
}

export function renderMatches() {
  const schedule = document.getElementById('match-schedule');
  if (!schedule) return;
  const upcoming = gameState.matches.filter(m => !m.result).slice(0, 5);
  schedule.innerHTML = upcoming.map(m => `
    <div class="match-card">
      <img src="${m.home.emblem}" alt="${m.home.name}" width="30"/>
      <span>${m.home.name} vs ${m.away.name}</span>
      <img src="${m.away.emblem}" alt="${m.away.name}" width="30"/>
    </div>
  `).join('');
}

export function simulateNextMatch() {
  if (gameState.season.phase === 'offseason') {
    showMessage('Sezonul este în pauză!', 'error');
    return;
  }
  const match = gameState.matches.find(m => !m.result);
  if (!match) {
    if (gameState.season.phase === 'regular') {
      startPlayOffOut();
    } else {
      startOffSeason();
    }
    return;
  }
  const homeRating = getTeamRating(match.home);
  const awayRating = getTeamRating(match.away);
  const result = simulateMatchResult(homeRating, awayRating);
  match.result = result;
  updateTeamStats(match.home, result);
  updateTeamStats(match.away, { homeGoals: result.awayGoals, awayGoals: result.homeGoals });
  gameState.season.currentDay += 2.27;
  gameState.gameDate.setDate(gameState.gameDate.getDate() + 3);
  if (Math.floor(gameState.season.currentDay) % 7 === 0) {
    refreshMarket();
  }
  saveGame();
  updateStandings();
  showMessage(`${match.home.name} ${result.homeGoals} - ${result.awayGoals} ${match.away.name}`, 'success');
  renderMatches();
}

function getTeamRating(team) {
  const players = team.name === gameState.club.name ? gameState.players : team.players;
  return players.reduce((sum, p) => sum + (p.rating * (p.stamina / 100) * (p.morale / 100)), 0) / players.length || 50;
}

function simulateMatchResult(homeRating, awayRating) {
  const diff = homeRating - awayRating;
  const homeGoals = Math.max(0, Math.floor(Math.random() * 5 + diff / 10));
  const awayGoals = Math.max(0, Math.floor(Math.random() * 5 - diff / 10));
  return { homeGoals, awayGoals };
}

function updateTeamStats(team, result) {
  const stats = gameState.standings.find(t => t.name === team.name);
  if (!stats) return;
  stats.goalsScored += result.homeGoals;
  stats.goalsConceded += result.awayGoals;
  if (result.homeGoals > result.awayGoals) {
    stats.points += 3;
  } else if (result.homeGoals === result.awayGoals) {
    stats.points += 1;
  }
}

function startPlayOffOut() {
  gameState.standings.sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded));
  if (gameState.club.division === 6) {
    startOffSeason();
    return;
  }
  const playOffTeams = gameState.standings.slice(0, 6);
  const playOutTeams = gameState.standings.slice(6);
  playOffTeams.forEach(t => { t.points = Math.ceil(t.points / 2); });
  playOutTeams.forEach(t => { t.points = Math.ceil(t.points / 2); });
  gameState.matches = [];
  const isPlayOff = playOffTeams.find(t => t.name === gameState.club.name);
  if (isPlayOff) {
    gameState.season.phase = 'play-off';
    for (let i = 0; i < playOffTeams.length; i++) {
      for (let j = i + 1; j < playOffTeams.length; j++) {
        gameState.matches.push({ home: playOffTeams[i], away: playOffTeams[j], phase: 'play-off' });
        gameState.matches.push({ home: playOffTeams[j], away: playOffTeams[i], phase: 'play-off' });
      }
    }
  } else {
    gameState.season.phase = 'play-out';
    for (let i = 0; i < playOutTeams.length; i++) {
      for (let j = i + 1; j < playOutTeams.length; j++) {
        gameState.matches.push({ home: playOutTeams[i], away: playOutTeams[j], phase: 'play-out' });
      }
    }
  }
  saveGame();
  showMessage(`Începe ${isPlayOff ? 'play-off' : 'play-out'}!`, 'success');
  renderMatches();
}

function startOffSeason() {
  gameState.season.phase = 'offseason';
  gameState.season.offseasonDays = 8;
  gameState.season.activitiesUsed = 0;
  handlePromotionRelegation();
  gameState.gameDate.setDate(gameState.gameDate.getDate() + 10);
  initializeSeason();
  saveGame();
  showMessage('Sezonul s-a încheiat! Pauza competițională a început.', 'success');
  loadComponent('offseason', 'components/offseason.html');
}

function handlePromotionRelegation() {
  gameState.standings.sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded));
  const div = gameState.club.division;
  const rank = gameState.standings.findIndex(t => t.name === gameState.club.name) + 1;
  if (div === 6) {
    if (rank <= 5) {
      gameState.club.division = 5;
      gameState.club.budget += 500000;
      showMessage('Felicitări! Clubul tău a promovat în Divizia 5!', 'success');
    }
  } else {
    if (rank <= 2) {
      gameState.club.division = Math.max(1, div - 1);
      gameState.club.budget += getBudgetForDivision(div - 1) / 5;
      showMessage(`Felicitări! Promovezi în Divizia ${gameState.club.division}!`, 'success');
    } else if (rank === 3 || rank === 4) {
      if (Math.random() > 0.3) {
        gameState.club.division = Math.max(1, div - 1);
        gameState.club.budget += getBudgetForDivision(div - 1) / 5;
        showMessage(`Ai câștigat barajul! Promovezi în Divizia ${gameState.club.division}!`, 'success');
      } else {
        showMessage(`Ai pierdut barajul, rămâi în Divizia ${div}!`, 'error');
      }
    } else if (rank === 9 || rank === 10) {
      gameState.club.division = Math.min(6, div + 1);
      gameState.club.budget /= 2;
      showMessage(`Ai retrogradat în Divizia ${gameState.club.division}!`, 'error');
    } else if (rank === 7 || rank === 8) {
      if (Math.random() > 0.3) {
        showMessage(`Ai câștigat barajul, rămâi în Divizia ${div}!`, 'success');
      } else {
        gameState.club.division = Math.min(6, div + 1);
        gameState.club.budget /= 2;
        showMessage(`Ai retrogradat în Divizia ${gameState.club.division}!`, 'error');
      }
    } else if (rank >= 11) {
      gameState.club.division = Math.min(6, div + 1);
      gameState.club.budget /= 2;
      showMessage(`Ai retrogradat în Divizia ${gameState.club.division}!`, 'error');
    }
  }
  gameState.teams = [];
  const newTeams = generateAITeamsForDivision(gameState.club.division);
  gameState.teams.push(...newTeams);
  gameState.standings = [];
  gameState.matches = [];
  saveGame();
}

function generateAITeamsForDivision(division) {
  const numTeams = division === 6 ? 31 : 15;
  const teams = [];
  for (let i = 0; i < numTeams; i++) {
    const name = generateTeamName();
    const emblemParams = generateEmblemParams(name, division);
    teams.push({
      name,
      division,
      emblem: generateEmblemFromParams(emblemParams),
      players: Array.from({ length: 18 }, () => generatePlayer(division)),
      budget: getBudgetForDivision(division),
      points: 0,
      goalsScored: 0,
      goalsConceded: 0
    });
  }
  return teams;
}

export function playFriendly() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4) {
    showMessage('Nu poți juca amicale acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 50) {
    gameState.club.energy -= 50;
    gameState.players.forEach(p => {
      p.morale = Math.min(p.morale + 10, 100);
      if (p.rating < 70 && Math.random() < 0.3) {
        p.rating += Math.floor(Math.random() * 5) + 1;
      }
    });
    gameState.club.budget += 100000;
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage('Meci amical jucat! Moral +10, venit +100K €!', 'success');
    renderOffseason();
  } else {
    showMessage('Energie insuficientă!', 'error');
  }
}

function getBudgetForDivision(div) {
  return [50000000, 20000000, 10000000, 5000000, 1000000, 100000][div - 1] || 100000;
}

window.simulateNextMatch = simulateNextMatch;
window.playFriendly = playFriendly;
