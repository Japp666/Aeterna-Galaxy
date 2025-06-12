import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';

export function renderTeam() {
  const roster = document.getElementById('roster');
  const facilities = document.getElementById('facilities');
  if (!roster || !facilities) return;

  roster.innerHTML = gameState.players.map(p => `
    <div class="player-card">
      <span>${p.name}</span>
      <span>${p.position}</span>
      <span>Rating: ${p.rating}</span>
      <span>Stamina: ${p.stamina}</span>
      <span>Moral: ${p.morale}</span>
      <span>Salariu: ${p.salary.toLocaleString()} €</span>
      <span>Contract: ${p.contractYears} ani</span>
    </div>
  `).join('');

  facilities.innerHTML = `
    <div class="facility-card">
      <h3>Stadion (Nivel ${gameState.club.facilities.stadium.level})</h3>
      <p>Capacitate: ${gameState.club.facilities.stadium.capacity}</p>
      <p>Cost upgrade: ${gameState.club.facilities.stadium.cost.toLocaleString()} €</p>
      <button id="upgrade-stadium" ${gameState.club.budget < gameState.club.facilities.stadium.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <div class="facility-card">
      <h3>Antrenament (Nivel ${gameState.club.facilities.training.level})</h3>
      <p>Efect: +${gameState.club.facilities.training.effect} rating</p>
      <p>Cost upgrade: ${gameState.club.facilities.training.cost.toLocaleString()} €</p>
      <button id="upgrade-training" ${gameState.club.budget < gameState.club.facilities.training.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <div class="facility-card">
      <h3>Academie (Nivel ${gameState.club.facilities.academy.level})</h3>
      <p>Rating tineret: ${gameState.club.facilities.academy.youthRating}</p>
      <p>Cost upgrade: ${gameState.club.facilities.academy.cost.toLocaleString()} €</p>
      <button id="upgrade-academy" ${gameState.club.budget < gameState.club.facilities.academy.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <div class="facility-card">
      <h3>Recuperare (Nivel ${gameState.club.facilities.recovery.level})</h3>
      <p>Efect: +${gameState.club.facilities.recovery.recovery} stamina</p>
      <p>Cost upgrade: ${gameState.club.facilities.recovery.cost.toLocaleString()} €</p>
      <button id="upgrade-recovery" ${gameState.club.budget < gameState.club.facilities.recovery.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <button id="renegotiate-contracts">Renegociază contracte</button>
  `;

  // Adăugăm event listeners
  document.getElementById('upgrade-stadium')?.addEventListener('click', () => upgradeFacility('stadium'));
  document.getElementById('upgrade-training')?.addEventListener('click', () => upgradeFacility('training'));
  document.getElementById('upgrade-academy')?.addEventListener('click', () => upgradeFacility('academy'));
  document.getElementById('upgrade-recovery')?.addEventListener('click', () => upgradeFacility('recovery'));
  document.getElementById('renegotiate-contracts')?.addEventListener('click', renegotiateContracts);
}

export function upgradeFacility(type) {
  const facility = gameState.club.facilities[type];
  if (gameState.club.budget >= facility.cost && gameState.club.energy >= 100) {
    gameState.club.budget -= facility.cost;
    gameState.club.energy -= 100;
    facility.level += 1;
    facility.cost = Math.floor(facility.cost * 1.5);
    if (type === 'stadium') {
      facility.capacity += 5000;
    } else if (type === 'training') {
      facility.effect += 2;
    } else if (type === 'academy') {
      facility.youthRating += 10;
    } else if (type === 'recovery') {
      facility.recovery += 5;
    }
    // Reducere 15% cost în pauză
    if (gameState.season.phase === 'offseason') {
      facility.cost = Math.floor(facility.cost * 0.85);
    }
    saveGame();
    showMessage(`Facilitate ${type} upgradată la nivel ${facility.level}!`, 'success');
    renderTeam();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}

export function renegotiateContracts() {
  const expiring = gameState.players.filter(p => p.contractYears < 1);
  if (expiring.length === 0) {
    showMessage('Niciun jucător cu contract expirat!', 'info');
    return;
  }
  if (gameState.club.energy >= 100) {
    gameState.club.energy -= 100;
    let totalCost = 0;
    expiring.forEach(p => {
      const newSalary = Math.floor(p.salary * 1.2);
      if (gameState.club.budget >= newSalary) {
        p.salary = newSalary;
        p.contractYears = 2;
        totalCost += newSalary;
      }
    });
    gameState.club.budget -= totalCost;
    saveGame();
    showMessage(`Contracte renegociate! Cost total: ${totalCost.toLocaleString()} €`, 'success');
    renderTeam();
  } else {
    showMessage('Energie insuficientă!', 'error');
  }
}
