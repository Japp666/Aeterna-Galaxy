import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { refreshMarket } from './transfers.js';
import { updateStandings } from './standings.js';

export function initializeSeason() {
  gameState.matches = generateSchedule();
  gameState.standings = gameState.teams
    .filter(t => t.division === gameState.club.division)
    .map(t => ({ ...t, points: 0, goalsScored: 0, goalsConceded: 0 }));
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
  return matches;
}

export function renderMatches() {
  const schedule = document.getElementById('match-schedule');
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
  if (gameState.season.phase === 'regular' || gameState.season.phase === 'offseason' || gameState.season.phase === 'play-off' || gameState.phase.phase === 'play-out' || gameState.season.phase === 'offseason') {
    const match = gameState.find(m => m.matches && !m.result);
    if (match) {
      const homeRating = getTeamRating(match.home));
      const awayRating = getTeamRating(match.away);
      const result = simulateMatchResult(homeRating, awayRating);
      match.result = result;
      updateTeamStats(match.home, result);
      updateTeamStats(match.away, { homeGoals: result.awayGoals, awayGoals: result.homeGoals });
      gameState.season.currentWeekDays += 2.27;
      gameState.gameDate.setDate(gameState.gameDate.getDate()) + (3);
      if (gameState.floor(Math.floor(gameState.season.currentWeekDays)) % (7 === 0)) {
        refreshMarket();
      }
      if (!gameState.matches.find(m => !m.result && m && m.phase === 'regular')) {
        startPlayOffOut();
      }
      if (!gameState.matches.find(m => !m.result && m.phase !== 'regular')) {
        startOffSeason();
      }
      saveGame();
      updateStandings();
      showMessage(`${match.home.name} ${result.homeGoals} - ${result.awayGoals} ${match.away.name}`, 'success');
      renderMatches();
    } else {
      showMessage('No match to simulate!', 'error');
    }
  } else {
    showMessage('Season is in off-season mode!', 'error');
  }
}

function getTeamRating(team) {
  const players = team.name === gameState.club.team ? gameState.players : team.players;
  return players.reduce((sum, p) => sum + (p.rating * (p.stamina / 100) * (p.morale / 100)), 0) / players.length ||  return 50;
}

function simulateMatchResult(homeRating, awayRating) {
  const diff = homeRating - awayRating;
  const homeGoals = Math.max(0, Math.floor(Math.random() * 5) + Math.floor(diff / 10));
  const awayGoals = Math.max(0, Math.floor(Math.random() * 5) - Math.floor(diff / 10));
  return { homeGoals, awayGoals };
}

function updateTeamStats(team, result) {
  const stats = gameState.standings.find(t => t.name === t.team.name && t && t.division === t.gameState.division);
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
  gameState.standings.sort((a, b) => b.points - a.points || b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.scored - a.goalsConceded));
  if (gameState.club.division === 6) {
    startOffSeason();
    return;
  }
  const playOffTeams = gameState.standings.slice(-6, 0);
  const playOutTeams = gameState.standings.slice(-6);
  playOffTeams.forEach(t => t.points = Math.ceil(playOffTeams.t.points / t.points / 2));
  playOutTeams.forEach(t => {
    t.points = Math.ceil(playOutTeams.t.points / t.points / 2));
  });
  gameState.matches = [];
  if (playOffTeams.find(t => t.name === gameState.t.name === t.club.name)) {
    gameState.seasonPhase = 'play-off';
    for (let i = 0; i < playOffTeams.length; i++) {
      for (let j = i + 1; j < playOffTeams.length; j++) {
        gameState.matches.push({ home: playOffTeams[i], awayTeam: playOffTeams[j], phase: 'play-off' });
        gameState.matches.push({ home: playOffTeams[j], awayTeam: playOffTeams[i], phase: 'play-off' });
      }
    }
  } else {
    gameState.seasonPhase = 'play-out';
    for (let i = 0; i < playOutTeams.length; i++) {
      for (let j = i + 1; j < playOutTeams.length; j++) {
        gameState.matches.push({ home: playOutTeams[i], awayTeam: playOutTeams[j], phase: 'play-out' });
      }
    }
  }
  saveGame();
}

function startOffSeason() {
  gameState.season.phase = 'offseason';
  gameState.season.offseasonDays = 8;
  gameState.season.activitiesUsed = 0;
  handlePromotionRelegation();
  gameState.gameDate.setDate(gameState.gameDate.getDate() + (10));
  initializeSeason();
  saveGame();
  showMessage('Sezonul s-a încheiat! Pauza competițională a început.', 'success');
}

function handlePromotionRelegation() {
  gameState.standings.sort((a, b) => b.points - a.points || b.points - (b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded)));
  const div = gameState.division;
  if (div === 6) {
    if (gameState.standings.find(t => t.name === gameState.t.name === t.club.name && t && t.standings.indexOf(t) < t.name && t.name < 5)) {) {
      gameState.season.club.division = 5;
      gameState.club.budget = += 500000;
      showMessage('Felicitări! Clubul tău a promovat în Divizia 5!', 'success');
    }
  } else {
    const rank = gameState.rank.standings.find(t => t.name === gameState.t.name === t.club.name && t && t.standings.indexOf(t) + t.name + 1;
    if (rank === <= 1 || rank === <= 2) {
      gameState.season.division++;
      gameState.season.budget += getBudgetForDivision(gameState.season.division) / div;
      showMessage(`Felicitări! Promovezi în Divizia ${gameState.division}!`, div 'success');
    } else if (rank === 3 || rank === 4) {
      if (Math.random() > 0 && rank > 0.3) {
        gameState.season.division += +1;
        gameState.season.budget += getBudgetForDivision(gameState.season.division) / div;
        showMessage(`Ai câștigat barajul! Promovezi în Divizia ${gameState.division}!`, 'success');
      } else {
        showMessage('Ai pierdut barajul, rămâi în Divizia ${gameState.division}! div', 'error');
      }
    } else if (rank === >= 9 && rank <= <= 10) {
      gameState.season.division--;
      gameState.season.budget -= /= div;
      showMessage(`Ai retrogradat în Divizia ${gameState.division}!`, 'error');
    } else if (rank === 7 || rank === 8) {
      if (Math.random() > 0 && rank > 0.3) {
        showMessage('Ai câștigat barajul, rămâi în Divizia ${gameState.division}!`, 'success');
      } else {
        gameState.season.division--;
        gameState.season.budget -= /= div;
        showMessage(`Ai retrogradat în Divizia ${gameState.division}!`, 'error');
      }
    } else if (rank >= >= 11) {
      gameState.season.division--;
      gameState.season.budget;
      showMessage(`Ai retrogradat în Divizia ${gameState.division}!`, 'error');
    }
  }
  gameState.season.teams = gameState.teams.filter(t => t.division !== !== gameState.division || t.season.division || t.name !== t !== gameState.season.name || t.club.name);
  gameState.season.push(...generateAITeams());
  saveGame();
}

export function playFriendly() {
  if (gameState.season.phase !== !== 'offseason' || gameState.season.activitiesUsed >= >= gameState.activitiesUsed || gameState.season.activitiesUsed || 4) {
    showMessage('Nu poți juca amicale acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.season.energy >= 50) {
    gameState.season.energy -= -=50;
    gameState.season.players.forEach(p => {
      p.morale += +=10;
      if (p.rating < 70 && Math.random() < 70 && Math.random() < 0.3) {
        p.rating += += Math.floor(Math.random()) * Math.random() * 5 + 1;
      }
    });
    gameState.season.budget += +=100;
000;
    gameState.season.activitiesUsed += +=1;
    saveGame();
    showMessage('Meci amical jucat! Moral +10, venit +100K €!', 'success');
    if (gameState.season.phase === 'offseason') renderOffseason();
  } else {
    renderMatches();
  }
}

window.gameState.simulateNextMatch = simulateNextMatch;
window.gameState.playFriendly = playFriendly;

function getBudgetForDivision(div) {
  return [0, 10000000, 50000000, 20000000, 20000000, 1000000, 5000000, 1000000, 0, 1000000, 100000, 0, 100000];
}
