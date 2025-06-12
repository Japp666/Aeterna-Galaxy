import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { generatePlayer } from './utils.js';

export function renderTeam() {
  document.getElementById('club-name').textContent = gameState.club.name;
  const playersList = document.getElementById('players-list');
  playersList.innerHTML = gameState.players.map(p => `
    <div class="table-row">
      <span>${p.name}</span>
      <span>${p.position}</span>
      <span>Rating: ${p.rating}</span>
      <span>Salariu: ${p.salary} €</span>
      <span>Contract: ${p.contractYears} ani</span>
    </div>
  `).join('');
  const facilitiesList = document.getElementById('facilities-list');
  facilitiesList.innerHTML = `
    <div class="table-row">
      <span>Stadion</span>
      <span>Nivel: ${gameState.club.facilities.stadium.level}</span>
      <span>Capacitate: ${gameState.club.facilities.stadium.capacity}</span>
    </div>
    <div class="table-row">
      <span>Teren Antrenament</span>
      <span>Nivel: ${gameState.club.facilities.training.level}</span>
      <span>Efect: +${gameState.club.facilities.training.effect}</span>
    </div>
    <div class="table-row">
      <span>Academie</span>
      <span>Nivel: ${gameState.club.facilities.academy.level}</span>
      <span>Rating Tineri: ${gameState.club.facilities.academy.youthRating}</span>
    </div>
    <div class="table-row">
      <span>Centru Recuperare</span>
      <span>Nivel: ${gameState.club.facilities.recovery.level}</span>
      <span>Recuperare: +${gameState.club.facilities.recovery.recovery}</span>
    </div>
  `;
}

export function upgradeFacility() {
  const facilities = gameState.club.facilities;
  const types = ['stadium', 'training', 'academy', 'recovery'];
  const selected = types[Math.floor(Math.random() * types.length)];
  const facility = facilities[selected];
  const cost = gameState.season.phase === 'offseason' ? facility.cost * 0.85 : facility.cost;
  if (gameState.club.budget >= cost && gameState.club.energy >= 100) {
    gameState.club.budget -= cost;
    gameState.club.energy -= 100;
    facility.level += 1;
    if (selected === 'stadium') facility.capacity += 5000;
    if (selected === 'training') facility.effect += 2;
    if (selected === 'academy') facility.youthRating += 5;
    if (selected === 'recovery') facility.recovery += 5;
    facility.cost *= 1.5;
    if (gameState.season.phase === 'offseason') {
      gameState.season.activitiesUsed += 1;
    }
    saveGame();
    showMessage(`Facilitate ${selected} upgradată la nivel ${facility.level}!`, 'success');
    renderTeam();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}

export function renegotiateContracts() {
  const expiring = gameState.players.filter(p => p.contractYears < 1);
  if (expiring.length === 0) {
    showMessage('Niciun contract de renegociat!', 'error');
    return;
  }
  if (gameState.club.energy >= 100 && gameState.season.activitiesUsed < 4) {
    gameState.club.energy -= 100;
    expiring.forEach(p => {
      const newSalary = p.salary * (1 + Math.random() * 0.3);
      if (gameState.club.budget >= newSalary * 2 && Math.random() > 0.3) {
        p.salary = Math.round(newSalary);
        p.contractYears = Math.floor(Math.random() * 3) + 1;
        p.morale += 20;
        showMessage(`${p.name} a semnat pe ${p.contractYears} ani!`, 'success');
      } else {
        gameState.players = gameState.players.filter(player => player.id !== p.id);
        showMessage(`${p.name} a refuzat și a plecat!`, 'error');
      }
    });
    if (gameState.season.phase === 'offseason') {
      gameState.season.activitiesUsed += 1;
    }
    saveGame();
    renderTeam();
  } else {
    showMessage('Energie insuficientă sau limită activități atinsă!', 'error');
  }
}

window.upgradeFacility = upgradeFacility;
window.renegotiateContracts = renegotiateContracts;
